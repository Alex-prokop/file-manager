export const commands = new Map([
    ['up',        { group: 'nwd', args: '0+' }],
    ['cd',        { group: 'nwd', args: '1'   }],
    ['ls',        { group: 'nwd', args: '0'   }],

    ['cat',       { group: 'fs',  args: '1'   }],
    ['add',       { group: 'fs',  args: '1'   }],
    ['mkdir',     { group: 'fs',  args: '1'   }],
    ['rn',        { group: 'fs',  args: '2'   }],
    ['cp',        { group: 'fs',  args: '2'   }],
    ['mv',        { group: 'fs',  args: '2'   }],
    ['rm',        { group: 'fs',  args: '1'   }],

    ['os',        { group: 'os',  args: '1', variants: new Set(['--EOL','--cpus','--homedir','--username','--architecture']) }],

    ['hash',      { group: 'hash', args: '1'  }],

    ['compress',  { group: 'zip',  args: '2'  }],
    ['decompress',{ group: 'zip',  args: '2'  }],
]);
