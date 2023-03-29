const data = [];

data.push({
    usrID: 'abc',
    id: '00000001',
    date: '01/04',
    work: 'created a github repository',
    xp: 'how to use github frameworks',
    competencies: ['ab', 'bc', 'cd' ],
});

data.push({
    usrID: 'abc',
    id: '00000002',
    date: '02/04',
    work: 'started web programming cw',
    xp: 'full stack development',
    competencies: ['ad', 'bd', 'cd' ],
});

data.push({
    usrID: 'abc',
    id: '00000003',
    date: '03/04',
    work: 'started web programming cw',
    xp: 'full stack development',
    competencies: ['ad', 'bd', 'cd' ],
});

data.push({
    usrID: 'abc',
    id: '00000004',
    date: '04/04',
    work: 'started web programming cw',
    xp: 'full stack development',
    competencies: ['ad', 'bd', 'cd' ],
});


export function getEntry(id) {
    return data.find(entry => entry.id === id);
}


export function getUserEntries(usrID) {
    return data.filter(entry => entry.usrID === usrID);
}

