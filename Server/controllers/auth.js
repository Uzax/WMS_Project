import User from "../models/User.js";
import bcrypt from "bcrypt";
import Counter from "../models/Counter.js";

export const checkLogin = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const userDetails = await User.find({ username: username.toLowerCase() });

    if (userDetails.length > 0) {
      const hashedPassword = userDetails[0].password;

      console.log(password, hashedPassword);

      bcrypt.compare(password, hashedPassword, function (err, result) {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Internal Server Error" });
          return;
        }
        console.log(result);

        if (result) {
          let user = userDetails[0];
          res.status(200).json({
            message: "Login Success",
            userData: {
              id: user.id,
              name: user.name,
              access: user.access,
              email: user.email,
              online: user.online,
            },
          });
        } else {
          res.status(401).json({ message: "Password is incorrect" });
        }
      });
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const ChangeStatus = async (req, res) => {
  try {
    const uid = req.body.id;
    const status = req.body.status;

    const newStatus = status === "1" ? "0" : "1";

    console.log(uid, status, newStatus);

    const Updated = await User.updateOne(
      { id: uid },
      { $set: { online: newStatus } }
    );

    res.status(200).json({ message: "Status Changed" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const SignUp = async (req, res) => {
  try {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;


    const alreadyExists = await User.find({ username: username.toLowerCase() });

    if (alreadyExists.length > 0) {
      console.log("User already exists!!!!!!");
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const User_id = await getNextSequence("User_id");

    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }

      await User.insertMany({
        id: User_id,
        name: name,
        username: username.toLowerCase(),
        password: hash,
        access: "worker",
        online: "0",
      });

      res.status(200).json({ message: "User Created" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

async function getNextSequence(name) {
  var ret = await Counter.find({ _id: name });
  console.log(ret);
  await Counter.updateOne({ _id: name }, { $inc: { seq: 1 } });

  return ret[0].seq;
}
