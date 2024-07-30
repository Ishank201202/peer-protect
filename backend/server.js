const express = require('express');
const ABI = require('./ABI.json');
const { Web3 } = require("web3");
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
const web3 = new Web3("https://wiser-cool-hill.ethereum-sepolia.quiknode.pro/622e9acaac30716adec19d99f635f55eb1681f8a");
const contractAddress = process.env.CONTRACTADDRESS
const contract = new web3.eth.Contract(ABI, contractAddress); 


app.post("/api/create-task", async (req, res) => {

});
app.get("/api/view-task/:taskId", async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await contract.methods.viewTask(taskId).call();
        const { id, name, date } = task;
        const numId = Number(id)
        const taskObj = {
            numId, name, date
        }

        if (task) {
            res.status(200).json({ taskObj: taskObj });
            console.log("from api", task)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
});

app.get("/api/view-all-task", async (req, res) => {
    // const { taskId } = req.params;
    try {
        const tasks = await contract.methods.allTask().call();
        if (tasks.length < 0) {
            res.status(404).json({ message: "tasksList doesnot exists" })
        }
        if (tasks.length > 0) {
            const taskList = tasks.map(({ id, name, date }) => {
                const taskId = Number(id);
                return { taskId, name, date }
            })
            res.status(200).json({ taskList: taskList })
        }
        // console.log(tasks);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`server running at port: ${process.env.PORT} `)
})