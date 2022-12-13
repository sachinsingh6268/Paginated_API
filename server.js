// JavaScript Pagination concept is applied for moving among the pages with First, Next, Previous and Last buttons or links. Pagination's main motto is to move among the content immediately by clicking links or buttons. Pagination has multiple links or buttons provided for access First, Next, Previous and Last content.
// Pagination in NodeJS is defined as adding the numbers to identify the sequential number of the pages. In pagination, we used to skip and limit for reducing the size of data in the database when they are very large in numbers.



// If we are not using middleware, then we will be writing the code for pagination for each of the route that we are creating(it's good to write if we have only few routes), but when we are having a lot of routes then it's not a good practice to write the same code in every of the route created. SO TO SOLVE THIS PROBLEM WE WILL USE MIDDLEWARES



// HOW A MIDDLEWARE WORKS??

// Express.js is a routing and Middleware framework for handling the different routing of the webpage and it works between the request and response cycle. Middleware gets executed after the server receives the request and before the controller actions send the response. Middleware has the access to the request object, responses object, and next, it can process the request before the server send a response. An Express-based application is a series of middleware function calls.

// Advantages of using middleware:
// Middleware can process request objects multiple times before the server works for that request.
// Middleware can be used to add logging and authentication functionality.
// Middleware improves client-side rendering performance.
// Middleware is used for setting some specific HTTP headers.
// Middleware helps for Optimization and better performance.


// Middleware Chaining: Middleware can be chained from one to another, Hence creating a chain of functions that are executed in order. The last function sends the response back to the browser. So, before sending the response back to the browser the different middleware process the request.

// The next() function in the express is responsible for calling the next middleware function if there is one else it will redirect to the function from where it has been called.

// Modified requests will be available to each middleware via the next function –

// Middleware chaining example
// In the above case, the incoming request is modified and various operations are performed using several middlewares, and middleware is chained using the next function. The router sends the response back to the browser.

// Middleware Syntax: The basic syntax for the middleware functions are as follows –

// app.get(path, (req, res, next) => {}, (req, res) => {})
// Middleware functions take 3 arguments: the request object, the response object, and the next function in the application’s request-response cycle, i.e., two objects and one function.

// Middleware functions execute some code that can have side effects on the app, and usually add information to the request or response objects. They are also capable of ending the cycle by sending a response when some condition is satisfied. If they don’t send the response when they are done, they start the execution of the next function in the stack. This triggers calling the 3rd argument, next().

// The middle part (req,res,next)=>{} is the middleware function. Here we generally perform the actions required before the user is allowed to view the webpage or call the data and many other functions. 






const express = require('express');
const app = express(); // by calling express as fn, we created an application which allows us to set up our entire server

const users = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
    { id: 4, name: "User 4" },
    { id: 5, name: "User 5" },
    { id: 6, name: "User 6" },
    { id: 7, name: "User 7" },
    { id: 8, name: "User 8" },
    { id: 9, name: "User 9" },
    { id: 10, name: "User 10" },
    { id: 11, name: "User 11" },
    { id: 12, name: "User 12" },
    { id: 13, name: "User 13" },
    { id: 14, name: "User 14" },
    { id: 15, name: "User 15" },
    { id: 16, name: "User 16" },
    { id: 17, name: "User 17" },
    { id: 18, name: "User 18" },
    { id: 19, name: "User 19" },
    { id: 20, name: "User 20" },
    { id: 21, name: "User 21" },
    { id: 22, name: "User 22" },
    { id: 23, name: "User 23" },
    { id: 24, name: "User 24" },
    { id: 25, name: "User 25" }
];

const posts = [
    { id: 1, name: "Post 1" },
    { id: 2, name: "Post 2" },
    { id: 3, name: "Post 3" },
    { id: 4, name: "Post 4" },
    { id: 5, name: "Post 5" },
    { id: 6, name: "Post 6" },
    { id: 7, name: "Post 7" },
    { id: 8, name: "Post 8" },
    { id: 9, name: "Post 9" },
    { id: 10, name: "Post 10" },
    { id: 11, name: "Post 11" },
    { id: 12, name: "Post 12" },
    { id: 13, name: "Post 13" },
    { id: 14, name: "Post 14" },
    { id: 15, name: "Post 15" },
    { id: 16, name: "Post 16" },
    { id: 17, name: "Post 17" },
    { id: 18, name: "Post 18" },
    { id: 19, name: "Post 19" },
    { id: 20, name: "Post 20" },
    { id: 21, name: "Post 21" },
    { id: 22, name: "Post 22" },
    { id: 23, name: "Post 23" }
];


app.get('/users', paginatedResults(users), (req, res) => { // "paginatedResults(users)" is the middleware here and will be called before the next fn to it is called, it has 3 parameters request,response and next(it will called when middleware will complete its execution and cursor will be given back to this very fn next to middleware fn)
    res.json(res.resultAfterPagination);
})


app.get('/posts',paginatedResults(posts),(req,res)=>{
    res.json(res.resultAfterPagination);
})




// Lets define a middleware
function paginatedResults(model) { // It will take the model that we want to paginate(here it is not model but when we work with databases, we pass the model)
    // A middleware function always takes request,response and next, so we need to actually return a fn which takes request,response and next. Normally when we create middleware, we wouldn't be able to pass anything to it, but in our case here we are passing(post) to this paginatedResults and we know that the result of this fn needs to be another fn that takes request, response, next. Thats we are making sure that we return a fn that takes request,response and next so it properly work as middleware and the way middleware works is it actually executes before all the code inside of our thing 

    return (req, res, next) => {
        const page = parseInt(req.query.page) // query is used when some values sent by the user after "?"
        const limit = parseInt(req.query.limit) // we have to parse these bcz requests are passed as strings 

        const startIndex = (page - 1) * limit // we are dividing pages where every page will have the maximum "limit" number of users
        const endIndex = page * limit


        const results = {} // it's an empty object

        // Now we will check if actually next page exists or not. For that we will put a condition and it will make sure that it will add next info iff next page exists
        if (endIndex < model.length) {
            results.next = { // next is for next page
                page: page + 1,
                limit: limit
            }

        }

        // Similarly for previous page, we will check if previous page exists by putting a condition it will make sure that it will add previous page info iff next page exists
        if (startIndex > 0) {
            results.previous = {  // previous is for previous page
                page: page - 1,
                limit: limit
            }

        }
        results.results = model.slice(startIndex, endIndex); // we have created key(results) and (users.slice(startIndex,endIndex)) as value pair in the results object here, Now results will be one of the member in the object


        // Now we have our results variable which we want to save so that it can be used by other chain of events in "app.get()", so for this what we can do is we can save it in our response as written below
        res.resultAfterPagination = results // we can call it(resultAfterPagination) whatever we want and we can access results with name "resultAfterPagination" in our "app.get()"

        // then we will give cursor back to our main fn in "app.get()"
        next(); // it will go to the "app.get()"
    }

}


app.listen(3000, () => { // this actually runs our server at the given port number and "app.listen" is saying that Hey our server is listening on port 3000 for a bunch of different requests
    console.log("Server is Running Fine!!")
})



