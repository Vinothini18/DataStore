const express = require('express')
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/read/:key', (req, res) => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
            res.send('Some Error occured');
        } else {
            data = JSON.parse(data)
            let key = req.params.key

            let currentTime = new Date().getTime() / 1000;
            currentTime = Math.round(currentTime)
            if (data[key]["ttl"] == 'undefined')
                res.send("Key not found")
            else {
                let data1 = data[key]["ttl"]
                if (data1 && data1 < currentTime) {
                    res.send("time expired")
                } else {
                    if (data[key])
                        res.send(data[key])
                    else
                        res.send("key not found")
                }
            }
        }
    });
});

app.post('/create', (req, res) => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
            res.send('Some Error occured');
        } else {
            data = JSON.parse(data)
            let key = Object.keys(req.body)[0]
            if (data[key])
                res.send("key already found")
            else {
                data[key] = req.body[key]
                let current = data[key]["ttl"]
                let seconds = new Date().getTime() / 1000;
                data[key]["ttl"] = Math.round(seconds) + current
                const newData = JSON.stringify(data);
                fs.writeFile('./data.json', newData, (err) => {
                    if (err) {
                        res.send('Some Error occured');
                    }
                    res.send(`${key} is added`);
                });
            }
        }
    });
});

app.delete('/delete/:key', (req, res) => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
        let key = req.params.key
        data = JSON.parse(data)
        let currentseconds = new Date().getTime() / 1000;
        currentseconds = Math.round(currentseconds)
        let time = data[key]["ttl"]
        if (time && time < currentseconds)
            res.send("Time expired")
        else {
            if (data[key]) {

                delete data[key];
                const newData = JSON.stringify(data);
                fs.writeFile('./data.json', newData, (err) => {
                    if (err) {
                        res.send('Some Error occured');
                    }
                    res.send(`${key} is deleted`);
                });

            } else {
                res.send('Key is not found');
            }
        }
    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))