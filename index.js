const Joi = require('joi')

const express = require('express');
const app = express();
const port = process.env.port || 45000;

app.use(express.json())


const postPutSchema = {
    name: Joi.string().min(1).required()
}
const getSchema = {
    query: Joi.string().regex(/^(id|name)$/).required()
}

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

// this does not make any sense in an real world app, because if you would click an element
// in the gui, always the id would be taken to find an element in the server, but yeah.. it`s 
// a playground ;)
app.get('/courses/:selector', (req, res) => {
    const {error} = Joi.validate(req.query, getSchema) // same as result.error
    if (error) validationError(res, error)
    
    if (req.query.query === 'name') {
        const course = courses.find(v => v.name === req.params.selector)
        if (!course) courseNotFound(res, req.params.selector)
        res.send(course);
    }
    const course = courseById(req.params.selector)
    if (!course) courseNotFound(res, req.params.selector)
    res.send(course);    

})

app.post('/courses', (req, res) => {
    const {error} = Joi.validate(req.body, postPutSchema)
    if (error) validationError(res, error)

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

app.put('/courses/:id', (req, res) => {
    const course = courseById(parseInt(req.params.id))
    if (!course) courseNotFound(res, req.params.id)
    const {error} = Joi.validate(req.body, postPutSchema)
    if (error) validationError(res, error)

    course.name = req.body.name
    res.send(course)
})

function validationError(res, error) {
    res.status(400).send(error.details[0].message);
}

function courseById(id) {
    return courses.find(v => v.id === parseInt(id));
}

function courseNotFound(res, selector) {
    res.status(404).send(`Course ${selector} not found`);
}

app.listen(port, () => console.log(`listening on port.. ${port} `));