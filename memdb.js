const data = [];

data.push({
    usrID: 'abc',
    id: '00000001',
    work: 'lots',
    xp: 'some',
    competencies: ['ab', 'bc', 'cd' ],
});

data.push({
    usrID: 'abc',
    id: '00000002',
    work: 'idek',
    xp: 'less',
    competencies: ['ad', 'bd', 'cd' ],
});


export function getEntry(id) {
    return data.find(entry => entry.id === id);
}

export function getUserEntries(usrID) {
    return data.filter(entry => entry.usrID === usrID);
}

