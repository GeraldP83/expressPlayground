const routeDebugger = require('debug')('app:routeDebug')
const Joi = require('joi')
const express = require('express')
const router = express.Router()
const {rSchema} = require('../joiSchema/crudSchema')
const {cuSchema} = require('../joiSchema/crudSchema')

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



router.get('/', (_, res) => {
    routeDebugger(`Courses: ${JSON.stringify(courses)}`)
    res.send(courses);
});

// this does not make any sense in an real world app, because if you would click an element
// in the gui, the id would be taken to find an element in the server, but yeah.. it`s 
// a playground ;)
router.get('/:selector', (req, res) => {
    routeDebugger(`Query: ${JSON.stringify(req.query)} \nParams: ${JSON.stringify(req.params)}`)
    const {error} = Joi.validate(req.query, rSchema) 
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

router.post('/', (req, res) => {
    const {error} = Joi.validate(req.body, cuSchema)
    if (error) return validationError(res, error)

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

router.put('/:id', (req, res) => {
    const course = courseById(parseInt(req.params.id))
    if (!course) return courseNotFound(res, req.params.id)
    const {error} = Joi.validate(req.body, cuSchema)
    if (error) return validationError(res, error)

    course.name = req.body.name
    res.send(course)
})

router.delete('/:id', (req, res) => {
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

module.exports = router;