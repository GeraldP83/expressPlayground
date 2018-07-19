const Joi = require('joi')

const express = require('express');
const app = express();
const port = process.env.port || 45000;

app.use(express.json())

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
  res.send('Hallo Gerald');
});

app.get('/courses', (req, res) => {
  res.send(courses);
});

app.get('/courses/:selector', (req, res) => {
  if (!req.query.hasOwnProperty('query')) res.status(404).send('A query must be given');
  if (req.query.query === 'name') {
    const course = courses.find(v => v.name === req.params.selector);
    if (!course) res.status(404).send(`Course ${req.params.selector} not found`);
    res.send(course);
  }
  else if (req.query.query === 'id') {
    const course = courses.find(v => v.id === parseInt(req.params.selector));
    if (!course) res.status(404).send(`Course ${req.params.selector} not found`);
    res.send(course);    
  }
  else res.status(404).send('Invalid params...')
});

app.post('/courses', (req, res) => {
    /*
    -- let`s use 'joi' instead of this approach
    if (!req.body.name || req.body.name.length == 0) {
        res.status(400).send('Name is mandatory')
        return
    }
    */
    const result = Joi.validate(req.body, schema)
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

app.listen(port, () => console.log(`listening on port.. ${port} `));

const schema = {
    name: Joi.string().min(1).required()
}
