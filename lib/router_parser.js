function parse_route(route) {
    const lines = route.split('\n')
    let res = {route: '', state: '', announced_by: '', bgp: {}};
    
    lines.map(line => {
        const indent_fixed = line.replace(/  /g, '')
        if (/BGP.*:/g.test(indent_fixed)) {
            const key = indent_fixed.match(/BGP.*?:/g)[0].split('.')[1].replace(/\:/g, '');
            switch (key) {
                case "as_path":
                    return res.bgp[key] = indent_fixed.replace(/BGP.*: /g, '').split(' ').map(net => net.replace(/\t/g, ''))
                case "community":
                    return res.bgp[key] = indent_fixed.replace(/BGP.*: /g, '').split(' ').map(comm => comm.replace(/[\t\(\)]/g, '').split(','))
                case "large_community":
                    return res.bgp[key] = indent_fixed.replace(/BGP.*: /g, '').match(/(\(\d+, \d+, \d+\))/g).map(lcom => lcom.replace(/[\t\(\) ]/g, '').split(','))
                default:
                    return res.bgp[key] = indent_fixed.replace(/BGP.*: /g, '').replace(/\t/g, '');
            }
        } else if (/.*\/\d*.*\w* \[v\d .* \w* .*\] \* \(\d*\) \[.*\]/g.test(indent_fixed)) {
            res['route'] = indent_fixed.match(/^.*\/\d*/g)[0]
            res['state'] = indent_fixed.replace(/^.*\/\d*( )*/g, '').replace(/ \[.*\]/g, '')
            res['announced_by'] = indent_fixed.replace(/.*\[/, '').replace(/[\w?]\]/g, '');
        } else if (/BIRD .* ready\./g.test(indent_fixed)) res['bird_version'] = indent_fixed.replace(/[(BIRD)(ready) ]/g, '').replace(/\.$/g, '');
    });

    return res;
}

module.exports = async function(stdout) {
    return new Promise((resolve, reject) => {
        const routes = stdout.match(/(.*((\[AS\d*[\w?]\])|(\[[\w?]\])|(\(\d+\)))\n)(\t.*\n)*/g);

        if (!routes || routes.length < 1) resolve([]);

        let parsed_routes = [];
        routes.map(route => {
            parsed_routes.push(parse_route(route));
        });
    
        resolve(parsed_routes);
    });
}