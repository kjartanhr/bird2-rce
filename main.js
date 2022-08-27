const express = require('express');
const app = express();
const cors = require('cors');
const { spawn } = require("child_process");
const parse_routes = require('./lib/router_parser');

app.use(cors());

app.get('/routes/:asn', async (req, res) => {
    const ls = spawn("birdc", ["sh", "ro", "all", "where", "bgp_path.last", "=", req.params.asn]);

    let stdout = "";
    let stderr = "";
    let error;

    ls.stdout.on("data", data => {
        stdout += data;
    });

    ls.stderr.on("data", data => {
        stderr += data;
    });

    ls.on('error', (error) => {
        error = error.message;
    });

    ls.on("close", async code => {
        if (error) res.json({err: error});
        else if (stderr) res.json({stderr});
        const routes = await parse_routes(stdout);
        res.json({routes});
    });
});

app.listen(8089, () => {
    console.log('Now serving requests on 0.0.0.0:8089');
});