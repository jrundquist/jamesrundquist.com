
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'James Rundquist' })
};

exports.sendEmail = function(req, res){
  
  var email = require('mailer');
  email.send({
    host : "localhost",              // smtp server hostname
    port : "25",                     // smtp server port
    domain : "localhost",            // domain used by client to identify itself to server
    to : "james.k.rundquist@gmail.com",
    from : "contact@jamesrundquist.com",
    subject : "Contact Email from: "+req.body.contact.n,
    template : "views/email/contact.txt",   // path to template name
    data : {
      "message": req.body.contact.m,
      "name": req.body.contact.n,
      "email": req.body.contact.e
    }
  },
  function(err, result){
    if(err){ console.log('Error:', err, req.body, result); }
  });
  res.render('include/response',{layout:false,data:'Thanks! I will get back to your shortly!'});
}
  
