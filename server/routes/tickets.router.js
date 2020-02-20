const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {rejectUnauthenticated} = require('../modules/authentication-middleware');
const axios = require('axios');

// send in req.query the column name and value to search for
router.get('/', rejectUnauthenticated, async (req, res) => {
    try{
        const equalQueries = [
            'id', 'resolved', 'zip', 'utility_id', 'program_id'
        ];
        const ilikeQueries = [
            'utility_name', 'program_name', 'comments'
        ];

        const config = [];
        const conditions = [];
        Object.entries(req.query).forEach(([key, value]) => {
            if(equalQueries.includes(key)){
                config.push(value);
                conditions.push(`${key}=$${config.length}`);
            } else if (ilikeQueries.includes(key)){
                config.push(`%${value}%`);
                conditions.push(`${key} ILIKE $${config.length}`);
            }
        });

        const {fromCompanies, fromUtility, fromProgram} = req.query;
        const isTrue = s => (s === 'true' || s === true);
        if(isTrue(fromCompanies) || isTrue(fromUtility) || isTrue(fromProgram)){
            const types = [];
            if(isTrue(fromCompanies)) types.push('type=0');
            if(isTrue(fromUtility)) types.push('type=1');
            if(isTrue(fromProgram)) types.push('type=2');
            conditions.push(`(${types.join(' OR ')})`);
        }

        let orderBy = 'date_submitted';
        if(req.query.orderBy){
            if( equalQueries.includes(req.query.orderBy) ||
                ilikeQueries.includes(req.query.orderBy) )
            {
                orderBy = req.query.orderBy;
            }
        }

        const order = req.query.order && req.query.order.toUpperCase() === 'ASC' ?
            'ASC' : 'DESC';

        const countQuery = `
            SELECT COUNT(*) FROM "tickets"
            ${conditions.length ? `WHERE ${conditions.join(' AND ')}`: ''}
        `;

        const countResults = await pool.query(countQuery, config);
        const {count} = countResults.rows[0];

        const ticketsQuery = `
            SELECT * FROM "tickets"
            ${conditions.length ? `WHERE ${conditions.join(' AND ')}`: ''}
            ORDER BY ${orderBy} ${order}
            LIMIT $${config.length+1}
            OFFSET $${config.length+2}`;
        config.push(req.query.limit || 100, req.query.offset || 0);
        const {rows: tickets} = await pool.query(ticketsQuery, config);
        res.send({tickets, count});
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});

// in req.body, just send keys = column names to enter into
// and values = actual values to enter.
router.post('/', async (req, res) => {
    try{
        const acceptedKeys = [
            'resolved', 'zip', 'utility_name',
            'program_name', 'gpp_id',
            'email', 'comments', 'eia_state', 'zips_id',
            'type', 'state'
        ];
        const config = [];
        const values = [];
        
        if(req.body.gpp_id) req.body.type = 2;
        else if(req.body.zips_id) req.body.type = 1;
        else req.body.type = 0;

        if(req.body.zip && !req.body.state){
            try {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.zip}&sensor=true&key=${process.env.GEOCODE_API_KEY}`)
                req.body.state = response.data.results[0].address_components
                    .filter(item => item.types.includes("administrative_area_level_1"))[0]
                    .short_name;
            } catch(error) {
                console.log(error);
            }
        }
        // for each key in req.body that is in acceptedKeys,
        // add $1 or $2 etc to values, add the value itself to
        // config, and map into keys the key itself.
        const keys = Object.entries(req.body)
            .filter(([key]) => acceptedKeys.includes(key))
            .map(([key, value], i) => {
                values.push(`$${i+1}`);
                config.push(value);
                return key;
            }).join(', ');
        
        const query = `
            INSERT INTO "tickets" (${keys})
            VALUES (${values.join(', ')})`;
        await pool.query(query, config);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});

router.put('/resolve/:id/:value', rejectUnauthenticated, async (req, res) => {
    try{
        const query = `
            UPDATE "tickets" SET "resolved"=$1
            WHERE "id"=$2`;
        await pool.query(query, [req.params.value, req.params.id]);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
})

module.exports = router;