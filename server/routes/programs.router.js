const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const axios = require('axios');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const dotenv = require('dotenv');
dotenv.config();
const gppCols =  require('../modules/gppColumns');

//-----< GEOCODE API ROUTE >-----\\
router.get('/geocode/:zip', (req,res)=>{
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.zip}&sensor=true&key=${process.env.GEOCODE_API_KEY}`)
      .then(response=>{
          if(response.data.results[0]){
              res.send(response.data.results[0].formatted_address);
          } else {
              res.sendStatus(500);
          }

      }).catch(error=>{
          console.log('Error getting geocode data from API:',error);   
          res.sendStatus(400);
      });
});

//-----< ZIPS TABLE ROUTES >-----\\
/*
  This route gets all of the utility companies in an area.
  Joins with the gpp table to get all programs for that company and returns them in an array.
*/
router.get('/:zip', async (req, res) => {
    try {
        const zipsCols = [
            'zip', 'eiaid',
            'state', 'eia_state'
        ]
        const cols = gppCols.filter(col => !zipsCols.includes(col));
        const query = `
        SELECT ${zipsCols.map(col => `"zips"."${col}"`).join(', ')}, "zips"."id" AS "zip_id",
            ${cols.map(col => `"gpp"."${col}"`).join(', ')}
        FROM "zips" LEFT JOIN  (
            SELECT * FROM "gpp" WHERE "gpp"."production"=1
        ) AS "gpp" ON "zips"."eia_state"="gpp"."eia_state"
        LEFT JOIN "utilities" on "zips"."eia_state"="utilities"."eia_state"
        WHERE "zips"."zip"=$1 AND "utilities"."production"=true;`;
        let programs = await pool.query(query, [req.params.zip]);
        programs = programs.rows;
        const dataToSend = [];
        programs.forEach(program => {
            let i = 0;
            for(; i < dataToSend.length && dataToSend[i].name !== program.utility_name; i++);
            if(i === dataToSend.length){
                dataToSend.push({
                    name: program.utility_name,
                    zip: program.zip,
                    eiaid: program.eiaid,
                    eia_state: program.eia_state,
                    state: program.state,
                    programs: []
                });
            }
            delete program.zip;
            delete program.eiaid;
            delete program.state;
            delete program.utility_name;
            delete program.eia_state;
            if(program.program_name){
                dataToSend[i].programs.push(program);
            }
        });

        res.send(dataToSend);
    } catch(error){
        res.sendStatus(500);
        console.log('-------- ERROR GETTING PROGRAMS AT ZIP -------- \n', error);
    }
});

//-----< GPP TABLE ROUTES >-----\\

/* 
  Retrieves all of the details about a particular program by row ID.
*/
// replace * with specific columns: Zip, utility name, program, sign up link //
router.get('/details/:id', async (req, res) => {
    try{
        const query = `
            SELECT * FROM "gpp" WHERE "id"=$1`;
        const results = await pool.query(query, [req.params.id]);
        res.send(results.rows[0]);
    } catch (error){
        res.sendStatus(500);
        console.log('-------- ERROR GETTING PROGRAM DETAILS -------- \n', error);
    }
});

/*
  Creates a new program in the gpp table
  NOTE: Has commented out authentication requirements, but it should not require that. All users can post information.
*/
router.post('/create', rejectUnauthenticated, async (req, res) => {
// router.post('/create', async (req, res) => {
    try{
        if(req.body.id) delete req.body.id;
        const injectors = [];
        const config = [];
        const cols = Object.entries(req.body)
            .filter(([key]) => gppCols.includes(key))
            .map(([key, value], i) => {
                config.push(value);
                injectors.push(`$${config.length}`);
                return key;
            }).join(', ');
        const query = `
            INSERT INTO "gpp" (${cols}) VALUES (${injectors.join(', ')})`;
        
        await pool.query(query, config);
        res.sendStatus(200);
    } catch (error){ 
        res.sendStatus(500);
        console.log(error);
    }
});

/*
  Updates an existing program in the gpp table.
  Requires authentication to allow modification.
*/
router.put('/update/:id', rejectUnauthenticated, async (req, res) => {
// router.put('/update/:id', async (req, res) => {
    try{
        const config = [req.params.id];
        const entries = Object.entries(req.body).filter(([key]) => gppCols.includes(key));

        // if all that's changing is "production" status, don't
        // update date_updated
        if(!req.body.date_updated && (entries.length > 1 || entries[0][0] !== 'production')){
            entries.push(['date_updated', new Date()]);
        }
        const cols = entries.map(([key, value], i) => {
                config.push(value);
                return `${key}=$${config.length}`;
            }).join(', ');

        const query = `
            UPDATE "gpp" SET ${cols}
            WHERE "gpp"."id"=$1`;
        await pool.query(query, config);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});

/*
  Deletes a program from the gpp table.
  Requires authentication to permit deletion.
*/
router.delete('/:id', rejectUnauthenticated, async(req,res)=>{
  try {
    const query = `
      DELETE FROM gpp WHERE id=$1;
    `;
    await pool.query(query, [req.params.id]);
    res.sendStatus(200);
  } catch(error) {
    console.log('Error deleting program from gpp table:',error);
    res.sendStatus(500);    
  }
});

module.exports = router;