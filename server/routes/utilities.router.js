const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const utilityCols = require('../modules/utilitiesColumns');
const zipCols = require('../modules/zipsColumns');
/* 
  Gets just then name of a utility company and its ID.
  Used on the details page once a program is selected
*/
router.get('/getName/:zip/:eia_state', async (req, res) => {
    try{
        const query = `
            SELECT "zips"."id" AS "zips_id", "utilities"."utility_name"
            FROM "zips" JOIN "utilities" ON "zips"."eia_state"="utilities"."eia_state"
            WHERE "zips"."zip"=$1 AND "zips"."eia_state"=$2`
        const {rows} = await pool.query(query, [req.params.zip, req.params.eia_state]);
        res.send(rows[0]);
    } catch (error) {
        res.sendStatus(500);
        console.log('Error getting utility company name:',error);
    }
});

/*
  Get the count of all utility companies in the database.
*/

function stringifyQueries(query,paramsArray) {

  //>>Collects the starting data to modify and return
  let final = {
    string: '',
    params: [...paramsArray],
    paramsStart: paramsArray.length
  };

  //>> Adds the junction to reflect position in filter string
  function conjunctionFunction(array) {
    return (array.length===final.paramsStart+1? ' WHERE ' : ' AND ');
  }

  //>> Builds a string to filter by
  for (let [key,value] of Object.entries(query)) {
      
    switch(key) {
      case 'state':
      case 'program_name':
        final.params.push('%'+value+'%');
        final.string += conjunctionFunction(final.params);
        final.string += `${(key==='program_name'? 'g':'z')}.${key} ILIKE $${final.params.length}`;
        break;
      case 'utility_name':
        final.params.push(`%${value}%`);
        final.string += conjunctionFunction(final.params);
        final.string += `u.${key} ILIKE $${final.params.length}`;
        break;
      case 'show':
        switch(value) {
          case 'active': final.params.push(true); break;
          case 'drafts': final.params.push(false); break;
        }   
        if (value!=='all') {
          final.string += conjunctionFunction(final.params);
          final.string += `u.production=$${final.params.length}`;
        }
        break;
      case 'zip':
        final.params.push(Number(value));
        final.string += conjunctionFunction(final.params);
        final.string += `z.zip=$${final.params.length}`;
        break;
    }
  }
  return final;
}

router.get('/count', async(req,res)=>{  
  try {

    let query = `
      SELECT COUNT(DISTINCT z.eia_state) FROM zips z
      LEFT JOIN gpp g ON z.eia_state = g.eia_state
      JOIN utilities u ON z.eia_state = u.eia_state
    `;
    let queryParams = [];
    
    const modify = stringifyQueries(req.query,queryParams);
    query += modify.string;
    queryParams = [...modify.params];
    const result = await pool.query(query,queryParams);
    res.send(result.rows[0]);
  } catch(error) {
    res.sendStatus(500);
    console.log('Error getting count of utilities:', error);
  }
})

/* 
  Get a summary of all utility companies.
  NOTE: Filters and sorts will be added to this eventually.
*/
router.get('/summary/:page', async(req,res)=>{
  //console.log(req.query);
  
  try {
    let query = `
    SELECT ARRAY_AGG("zips") as zips, eia_state, utility_name, state,
    program_count, programs, production, utility_id
    FROM (
      SELECT json_build_object('id', z.id, 'zip', z.zip) as "zips",
        u.eia_state, u.utility_name, u.state,
        COUNT(g.utility_name) as program_count,
        u.production AS production, u.id AS utility_id,
        array_agg(
          jsonb_build_object('name', g.program_name, 'id', g.id, 'production', g.production)
          ORDER BY g.id
        ) as programs
      FROM utilities as u
      LEFT JOIN zips z ON u.eia_state=z.eia_state
      LEFT JOIN gpp g ON z.eia_state=g.eia_state
    `;

    let queryParams = [req.params.page*100];
    const modify = stringifyQueries(req.query,queryParams);
    query += modify.string;
    queryParams = [...modify.params];
    
    let order = '';
    switch(req.query.order) {
      case 'utility_name': order = 'utility_name'; break;
      case 'state': order = 'state'; break;
      case 'zip': order = 'zips'; break;
      case 'program_count': order = 'program_count'; break;
      // case 'production': order = 'production'; break;
    }

    let dir = (req.query.orderDir==='ASC'? 'ASC' : 'DESC');
    

    query += `
      GROUP BY z.id, u.utility_name, u.production, u.id
      ) AS td
      GROUP BY eia_state, utility_name, state, program_count,
        programs, production, utility_id
      ORDER BY ${order} ${dir}
      LIMIT 100 OFFSET $1;`;

    const result = await pool.query(query,queryParams);
    // AFAIK, there is no way to prevent Postgres from
    // returning a null JSON
    result.rows.forEach(item => {
      if(item.programs[0].id === null){
        item.programs.pop();
      }
    });
    res.send(result.rows);
  } catch(error) {
    res.sendStatus(500);
    console.log('Error getting utility summary list:', error);    
  }
});


router.get('/details/:id', async (req, res) => {
  try{
      const query = `
          SELECT ARRAY_AGG("zips") as zips, eia_state, utility_name, state,
          program_count, programs, production, utility_id
          FROM (
          SELECT json_build_object('id', z.id, 'zip', z.zip) as "zips",
              u.eia_state, u.utility_name, u.state,
              COUNT(g.utility_name) as program_count,
              u.production AS production, u.id AS utility_id,
              array_agg(
                  jsonb_build_object('name', g.program_name, 'id', g.id, 'production', g.production)
                  ORDER BY g.id
              ) as programs
          FROM utilities u 
          LEFT JOIN zips z ON u.eia_state=z.eia_state
          LEFT JOIN gpp g ON z.eia_state=g.eia_state
          WHERE u.id=$1
          GROUP BY z.id, u.utility_name, u.production, u.id
          ) AS td
          GROUP BY eia_state, utility_name, state, program_count,
            programs, production, utility_id
      `
      const response = await pool.query(query, [req.params.id]);
      const valueToSend = response.rows[0];
      valueToSend.programs = valueToSend.programs.filter(program => program.id !== null);
      res.send(valueToSend);
  } catch(error){
      res.sendStatus(500);
      console.log('-------- ERROR GETTING UTILITY DETAILS -------- \n', error);
  }
});

/* 
  Gets the info to edit a single utility company 
*/
router.get('/edit/:id', rejectUnauthenticated, async(req,res)=>{

  // If zip db id is needed, use this select instead
  // SELECT ARRAY_AGG(distinct jsonb_build_object('id', z.id, 'zip', z.zip)) as "zips",
  try {
    const query = `
      SELECT ARRAY_AGG(z.zip) as "zips",
          u.utility_name, 
          u.eia_state,
          u.eiaid,
          u.state,
          u.bundled_avg_comm_rate,
          u.bundled_avg_ind_rate,
          u.bundled_avg_res_rate,
          u.delivery_avg_comm_rate, 
          u.delivery_avg_ind_rate,
          u.delivery_avg_res_rate,
          u.production,
          u.id
        FROM utilities u
        LEFT JOIN zips z ON u.eia_state=z.eia_state
        WHERE u.id=$1
        GROUP BY z.eia_state, z.state, z.eiaid, u.utility_name, u.id, u.production;
    `;
    const response = await pool.query(query,[req.params.id]);
    response.rows[0].zips = response.rows[0].zips.filter(zip=>zip);
    res.send(response.rows[0])
  } catch(error) {
    console.log('Error getting utility to edit:',error);
    res.sendStatus(500);
  }
});

/* 
  Posts a new utility company to the utilities table.
*/
router.post('/', rejectUnauthenticated, async(req,res)=>{
   //>> Collect the info from the req.body into usable arrays
  if(req.body.state && req.body.eiaid){
    req.body.eia_state = req.body.eiaid + req.body.state;
  } else {
    res.sendStatus(400);
    return;
  }

  const config = [];
  const keys = Object.entries(req.body)
    .filter(([key, value]) => {
      return utilityCols.includes(key) && value !== '';
    }).map(([key, value]) => {
      config.push(value)
      return `${key}`
    });
  
  //>> Construct the query from those arrays
  const query = `INSERT INTO utilities (${keys.join(', ')}) VALUES (${keys.map((key,i)=>`$${i+1}`).join(', ')});`;

  //>> Construct queries if zips are present
  const zip_config = [];
  if (req.body.zips) {
    //>> Collect the info from the req.body into usable arrays
    const zip_keys = Object.entries(req.body)
      .filter(([key, value]) => value !== '' && zipCols.includes(key))
      .map(([key, value]) => {
        zip_config.push(value);
        return `${key}`;
      });
    //>> Construct the query from those arrays
    zip_query = `INSERT INTO zips (zip,${zip_keys.toString()}) VALUES ($1,${zip_keys.map((key,i)=>`$${i+2}`).join(', ')});`;
  }
  
  try {
    await pool.query(query, config);

    if (req.body.zips) {
      for (let i=0; i<req.body.zips.length; i++) {
        await pool.query(zip_query,[req.body.zips[i], ...zip_config])
      }
    }

    res.sendStatus(201);
  } catch(error) {
    res.sendStatus(500);
    console.log('Error posting new utility company:',error);
  }
});

/* 
  Deletes a utility company from the zips table.
  Requires a user to be authenticated to permit deletion.
*/
router.delete('/:id', rejectUnauthenticated, async(req,res)=>{
  try {
    const query = `
      DELETE FROM zips WHERE id=$1;
    `;
    await pool.query(query, [req.params.id]);
    res.sendStatus(200);
  } catch(error) {
    res.sendStatus(500);
    console.log('Error deleting utility company:',error);    
  }
});

/* 
  Updates a utility company on the zips table.
  Requires a user to be authenticated to permit modification.
*/
router.put('/:id', rejectUnauthenticated, async(req,res)=>{

  let queryData = [req.params.id];
  let inserts = [];

  for (let [key,value] of Object.entries(req.body)) {
    //>> Not using anything that isn't needed or provided elsewhere
    if (key!=='id' && key!=='zips' && (key!=='state' && key!=='eiaid') )  {      
      queryData.push(value);
      inserts.push(`${key}=$${inserts.length+2}`);
    }
  }

  try {
    const query = `
      UPDATE utilities 
      SET ${inserts.toString()}
      WHERE id=$1;
    `;
    await pool.query(query, queryData);

    //>> Check every zip that exists vs what we now have and make changes
    const existingZipsResult = await pool.query(`SELECT zip, id FROM zips WHERE eia_state=$1`,[req.body.eia_state]);
    const existingZips = existingZipsResult.rows.map(item=>item.zip);

    //Check to see if the existing zips is missing anything, then create it
    const zips = req.body.zips;
    for (let i=0; i<zips.length; i++) {
      if (!existingZips.includes(zips[i])) {
        await pool.query(`INSERT INTO zips (zip,eiaid,state,eia_state) VALUES ($1,$2,$3,$4);`,[zips[i],req.body.eiaid,req.body.state,req.body.eia_state]);
      }
    }

    //Check to see if anything has been removed from the existing zips, then delete it
    for (let i=0; i<existingZips.length; i++) {
      if (!zips.includes(existingZips[i])) {
        await pool.query(`DELETE FROM zips WHERE id=$1`,[existingZipsResult.rows[i].id]);
      }
    }

    res.sendStatus(200);
  } catch(error) {
    res.sendStatus(500);
    console.log('Error updating existing utility company:', error);
  }
});

/* 
  Updates the production status of a utility company.
*/
router.put('/production/:id', rejectUnauthenticated, async(req,res)=>{
  try {
    const query = `UPDATE utilities SET production=$1 WHERE id=$2;`;
    await pool.query(query,[req.body.production,req.params.id]);
    res.sendStatus(200);
  } catch(error) {
    res.sendStatus(500);
    console.log('Error updating company production status:', error);
    
  }
});

module.exports = router;