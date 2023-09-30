const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyparser = require('body-parser')
//const pug=require('pug');

var app = express();
app.use('/static', express.static('static'))
app.use(express.urlencoded())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
var home = fs.readFileSync("shovon.html", "utf-8");
var about = fs.readFileSync("about.html", 'utf-8');
var contact = fs.readFileSync("contact.html", 'utf-8');
var login = fs.readFileSync("login.html", 'utf-8');
var register = fs.readFileSync("register.html", 'utf-8');
var registerfirst = fs.readFileSync("registerfirst.html", 'utf-8');
var menu = fs.readFileSync("menu.html", 'utf-8');
var payment = fs.readFileSync("payment.html", 'utf-8');
var ticketselect = fs.readFileSync("ticket_select.html", 'utf-8');
var adminpanel = fs.readFileSync("adminpanel.html", 'utf-8');
var adminavailable= fs.readFileSync('adminavailable.html','utf-8');
var adminticketselect=fs.readFileSync('adminticketselect.html','utf-8');
var adminpayment=fs.readFileSync('adminpayment.html','utf-8');
var feedback=fs.readFileSync('feedback.html','utf-8');
var reschedule=fs.readFileSync('reschedule.html','utf-8');
const localhost = '127.0.0.1';
const port = 80;

var mongoose = require('mongoose');
const { stringify } = require('querystring');
const { text } = require('body-parser');
mongoose.connect('mongodb://127.0.0.1/shovon');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log('Connection is set up perfectly')
});

const registrys = new mongoose.model('registri', { name: String, email: String, phone: String, dob: String, address: String, fpassword: String, rpassword: String });
const buses = new mongoose.model('buse', { busname: String, starting_from: String, destination: String, doj: String, deperture: String, nos: Number });
const bookings = new mongoose.model('booking', { busname: String, starting_from: String, destination: String, doj: String, deperture: String, seat: String, email: String });
const purchases = new mongoose.model('purchase', { busname: String, starting_from: String, destination: String, doj: String, deperture: String, seat: String, email: String });
const admins = new mongoose.model('admin', { name: String, email: String, phone: String, password: String })
const feedbacks=new mongoose.model('feedback',{name:String, email:String, description:String})
const unavailables=new mongoose.model('unavailable',{starting_from:String, destination:String, doj:String, deperture:String})
let timerid = {};
let id;
app.get("/", (req, res) => {
    //res.writeHead(200,{"content-type":"text/html"});
    res.send(home);
})
app.get("/about", (req, res) => {
    //res.writeHead(200,{"content-type":"text/html"});
    res.send(about);
})
app.get("/contact", (req, res) => {
    //res.writeHead(200,{"content-type":"text/html"});
    res.send(contact);
})

app.get("/menu", (req, res) => {
    //res.writeHead(200,{"content-type":"text/html"});

    res.send(menu);
})
app.get("/payment", (req, res) => {
    res.send(payment);
})
app.get('/adminticketselect',(req,res)=>{
    res.send(adminticketselect);
})
app.get('/adminavailable',(req,res)=>{
    res.send(adminavailable);
})
app.get('/adminpayment',(req,res)=>{
    res.send(adminpayment);
})
// app.get('/feedback',(req,res)=>{
//     res.send(feedback);
// })
app.get('/reschedule',(req,res)=>{
    res.send(reschedule);
})
app.post('/contact',async(req,res)=>{
    console.log(req.body);
    if(req.body)
    {console.log('hello');}
    let description = new feedbacks({ name: req.body.nam, email: req.body.mail,description:req.body.descrip });
    let description1 = await description.save();
    res.json({status:'done'});
})
app.post('/feedback',async(req,res)=>{
    let feed=await feedbacks.find();
    res.json(feed);
})
app.get('/feedback',(req,res)=>{
    res.send(feedback);
})
app.post('/payment', async (req, res) => {
    console.log(req.body);
    let last = await bookings.find({ starting_from: req.body.starting, destination: req.body.reach, doj: req.body.journey, email: req.body.mail });
    console.log(last);
    res.json(last);
})
app.post('/payment2', async (req, res) => {
    console.log('nehi', req.body);
    let payment_details = req.body;
    for (let p = 0; p < payment_details.length; p++) {

        let sheshd = await bookings.findOneAndDelete(payment_details[p]);
        let sheshs = new purchases(payment_details[p]);
        let shesh = await sheshs.save()
        let reduce = await buses.updateOne({ busname: payment_details[p].busname, starting_from: payment_details[p].starting_from, destination: payment_details[p].destination, doj: payment_details[p].doj }, { $inc: { nos: -1 } });
        console.log(reduce);
    }

})
app.get("/ticketselect", (req, res) => {
    // res.writeHead(200,{"content-type":"text/html"});
    res.send(ticketselect);
})
app.post("/ticketselect1", async (req, res) => {
    // res.writeHead(200,{"content-type":"text/html"});
    console.log(req.body);
    let seat1 = new bookings({ busname: req.body.name, starting_from: req.body.start, destination: req.body.reach, doj: req.body.date, deperture: req.body.time, seat: req.body.s, email: req.body.mail });
    let seatitem = await seat1.save();
    res.json({ status: 'done' });
    id = setTimeout(async () => {
        let avai = await purchases.findOne({ busname: req.body.name, starting_from: req.body.start, destination: req.body.reach, doj: req.body.date, deperture: req.body.time, seat: req.body.s, email: req.body.mail })
        if (!avai) {
            let del = await bookings.findOneAndDelete({ busname: req.body.name, starting_from: req.body.start, destination: req.body.reach, doj: req.body.date, deperture: req.body.time, seat: req.body.s, email: req.body.mail });
        }
    }, 300000);
    timerid[`${req.body.mail}${req.body.name}${req.body.start}${req.body.reach}${req.body.date}${req.body.s}`] = id;
    console.log(id, "hello");
})
app.post("/ticketselect2", async (req, res) => {
    console.log(req.body);
    clearTimeout(timerid[`${req.body.mail}${req.body.name}${req.body.start}${req.body.reach}${req.body.date}${req.body.s}`]);
    let seatitem1 = await bookings.findOneAndDelete({ busname: req.body.name, starting_from: req.body.start, destination: req.body.reach, doj: req.body.date, deperture: req.body.time, seat: req.body.s, email: req.body.mail });
    console.log('hi', seatitem1);
    if (seatitem1) {
        res.json({ status: 'done' });
    }
    else {
        res.json({ status: 'notdone' });
    }
})
// app.post("/ticketselect3", async (req, res) => {
//     console.log(req.body);
//     const seatitem2 = await bookings.findOne({ busname: req.body.name, starting_from: req.body.start, destination: req.body.reach, doj: req.body.date, deperture: req.body.time, seat: req.body.s, email: req.body.mail })
//     if (!seatitem2) {
//         const seatitem3 = await bookings.findOneAndDelete({ busname: req.body.name, starting_from: req.body.start, destination: req.body.reach, doj: req.body.date, deperture: req.body.time, seat: req.body.s });

//         console.log('hi', seatitem3);
//         if (seatitem3) {
//             res.json({ status: 'done' });
//         }
//         else {
//             res.json({ status: 'notdone' });
//         }
//     }
// })
app.post("/ticketselect4", async (req, res) => {
    console.log(req.body);
    let cancelbooking = await bookings.find({ email: req.body.mail });
    res.json(cancelbooking);
    for (let c = 0; c < cancelbooking.length; c++) {
        clearTimeout(timerid[`${cancelbooking[c].email}${cancelbooking[c].busname}${cancelbooking[c].starting_from}${cancelbooking[c].destination}${cancelbooking[c].doj}${cancelbooking[c].seat}`]);
    }
    let seatitem4 = await bookings.deleteMany({ email: req.body.mail })
    if (seatitem4) {
        console.log('hi', seatitem4);
        //res.json({ status: 'done' });
    }
})
app.post("/ticketselect5", async (req, res) => {
    console.log(req.body);
    let valid = await bookings.find({ email: req.body.mail })
    if (valid.length) {
        // console.log('hi', seatitem4);
        res.json(valid);
        //console.log(valid,"haha");
        for (let c = 0; c < valid.length; c++) {
            clearTimeout(timerid[`${valid[c].email}${valid[c].busname}${valid[c].starting_from}${valid[c].destination}${valid[c].doj}${valid[c].seat}`]);
        }
        for (let c = 0; c < valid.length; c++) {
            id = setTimeout(async () => {

                let validity = await bookings.findOneAndDelete({ busname: valid[c].busname, starting_from: valid[c].starting_from, destination: valid[c].destination, doj: valid[c].doj, deperture: valid[c].deperture, seat: valid[c].seat, email: valid[c].email });

            }, 300000);
            timerid[`${valid[c].email}${valid[c].busname}${valid[c].starting_from}${valid[c].destination}${valid[c].doj}${valid[c].seat}`] = id;
        }


    }
    else {
        res.json({ status: 'dont' });
    }
})
app.post('/ticketselect6', async (req, res) => {
    let deta = req.body;
    let show1 = await buses.find({ starting_from: deta[0].starting_from, destination: deta[0].destination, doj: deta[0].doj })
    res.json(show1)
})

app.post("/ticketselect", async (req, res) => {
    // res.writeHead(200,{"content-type":"text/html"});
    console.log(req.body);
    let seatsb = await bookings.find({ busname: req.body.name, starting_from: req.body.start, destination: req.body.reach, doj: req.body.date, seat: req.body.s })
    let seatsp = await purchases.find({ busname: req.body.name, starting_from: req.body.start, destination: req.body.reach, doj: req.body.date, seat: req.body.s })
    console.log('hello', seatsb);
    console.log('hello', seatsp);
    if (seatsb.length) {
        res.json({ name: req.body.name, seat: req.body.s, state: 'lime' });
        console.log('lime');
    }
    else if (seatsp.length) {
        res.json({ name: req.body.name, seat: req.body.s, state: '#888888b8' });
        console.log('grey');
    }
    else {
        res.json({ name: req.body.name, seat: req.body.s, state: 'white' });
        console.log('white');
    }
})

app.get("/login", (req, res) => {
    //res.writeHead(200,{"content-type":"text/html"});

    res.send(login);
})
app.get('/adminpanel',(req,res)=>{
    res.send(adminpanel);
})
app.post("/login", async (req, res) => {
    //res.writeHead(200,{"content-type":"text/html"});
    console.log(req.body);
    if (req.body.rad == 'admin') {
        let adm = await admins.find({ email: req.body.usermail, password: req.body.password });
        console.log(adm)
        if (adm.length) {
            console.log('yes');
            res.json({status:"proceed", name:adm[0].name});
            //res.send(adminpanel);
        }
        else {
            res.send(login);
        }
    }
    else {
        let user = await registrys.findOne({ email: req.body.usermail, fpassword: req.body.password });
        console.log(user);
        if (user) {
            res.json(user);
        }
        else {
            res.send(login);
        }
    }
})
app.get("/register", (req, res) => {
    //res.writeHead(200,{"content-type":"text/html"});
    res.send(register);
})
app.post("/register", (req, res) => {
    //res.writeHead(200,{"content-type":"text/html"});
    let item = new registrys(req.body);
    console.log(req.body);
    async function saving() {
        let data = await item.save();
    }
    saving();
    // async function finding() {
    //     let kitty = await registrys.find();
    //     console.log(kitty);
    // }
    // finding();
    res.send(login);
})

app.post('/menu', async (req, res) => {
    console.log(req.body);
    if (req.body.doj) {
        let avail = await buses.find({ starting_from: req.body.starting, destination: req.body.destination, doj: req.body.doj });
        if (avail.length > 0) {
            res.json(avail);
            console.log(avail);
            console.log('hello');
        }
        else {
            let check=await unavailables.find({starting_from: req.body.starting, destination: req.body.destination, doj: req.body.doj, deperture: '10:30'})
            if(check.length==0)
            {
            bus1 = new buses({ busname: 'Bus-1', starting_from: req.body.starting, destination: req.body.destination, doj: req.body.doj, deperture: '10:30', nos: 40 });
            let item1 = await bus1.save();}
            let check2=await unavailables.find({starting_from: req.body.starting, destination: req.body.destination, doj: req.body.doj, deperture: '04:30'})
            if(check2.length==0)
            {
            bus2 = new buses({ busname: 'Bus-2', starting_from: req.body.starting, destination: req.body.destination, doj: req.body.doj, deperture: '04:30', nos: 40 });
            let item2 = await bus2.save();}
            let create = await buses.find({ starting_from: req.body.starting, destination: req.body.destination, doj: req.body.doj });
            res.json(create);
            console.log(create);
        }
    }
})
app.post('/menu1',async(req,res)=>{
    console.log(req.body);
    let un=new unavailables({starting_from:req.body.starting, destination:req.body.destination, doj:req.body.doj, deperture:req.body.depert});
    let un1=await un.save();
})

app.listen(port, () => {
    console.log(`The server is created at http://${localhost}`);
})
