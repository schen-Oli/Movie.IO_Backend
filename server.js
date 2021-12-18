const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

let generalData = require('./routes/generalData');
let details = require('./routes/getMediaDetails');
let casts = require('./routes/getCasts');
let recSim = require('./routes/recSim');
let review = require('./routes/getReview');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/data', generalData);
app.use('/detail', details);
app.use('/casts', casts);
app.use('/rec&sim', recSim);
app.use('/review', review);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
    console.log(`http://localhost:${PORT}/`);
})

module.exports = app;