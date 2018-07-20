// set an DEBUG=app:debug env var, DEBUG=app:*  or DEBUG= to disable 
const devDebugger = require('debug')('app:debug')
const routeDebugger = require('debug')('app:routeDebug')
const Joi = require('joi')
const morgan = require('morgan')
const express = require('express');
const app = express();
const port = process.env.port || 45000;


/*
 middleware section
 they are called in sequence and should be in index.js or app.js or so on :)
 custom middleware functions must call next() at the end to pass the res 
 to the next layer in the pipeline.
 but be aware... middleware will slow down processing requests
*/
app.use(express.json())
app.use(express.static('public'))

// only use morgen logging if NODE_ENV is undefined or set to development
if (app.get('env') === 'development') app.use(morgan('dev'))

const postPutSchema = {
    name: Joi.string().min(1).required()
}
const getSchema = {
    query: Joi.string().regex(/^(id|name)$/).required()
}

let courses = [{
        id: 1,
        name: 'course1'
    },
    {
        id: 2,
        name: 'course2'
    },
    {
        id: 3,
        name: 'course3'
    }
];

app.get('/', (req, res) => {
    res.send(`Express Playground! Possible routes: /courses
    /courses/(id|name)?query=(id|name) `);
});

app.get('/courses', (req, res) => {
    routeDebugger(`Courses: ${JSON.stringify(courses)}`)
    res.send(courses);
});

// this does not make any sense in an real world app, because if you would click an element
// in the gui, always the id would be taken to find an element in the server, but yeah.. it`s 
// a playground ;)
app.get('/courses/:selector', (req, res) => {
    routeDebugger(`Query: ${JSON.stringify(req.query)} \nParams: ${JSON.stringify(req.params)}`)
    const {error} = Joi.validate(req.query, getSchema) // same as result.error
    if (error) return validationError(res, error)
    
    if (req.query.query === 'name') {
        const course = courses.find(v => v.name === req.params.selector)
        if (!course) return courseNotFound(res, req.params.selector)
        return res.send(course);
    }
    const course = courseById(req.params.selector)
    if (!course) return courseNotFound(res, req.params.selector)
    res.send(course);
})

app.post('/courses', (req, res) => {
    const {error} = Joi.validate(req.body, postPutSchema)
    if (error) return validationError(res, error)

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

app.put('/courses/:id', (req, res) => {
    const course = courseById(parseInt(req.params.id))
    if (!course) return courseNotFound(res, req.params.id)
    const {error} = Joi.validate(req.body, postPutSchema)
    if (error) return validationError(res, error)

    course.name = req.body.name
    res.send(course)
})

app.delete('/courses/:id', (req, res) => {
    const course = courseById(req.params.id)
    if (!course) return courseNotFound(res, req.params.id)
    // find the index of the given element and use splice instead of filter?
    // then courses could be const 
    courses = courses.filter( c => c.id !== parseInt(req.params.id))
    res.send(courses)
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

app.listen(port, () => devDebugger(`listening on port.. ${port} `));