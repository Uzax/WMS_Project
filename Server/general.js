import express from "express";
import fs from "fs";
import Bins from "./models/Bins.js";
import axios from "axios";

const router = express.Router();

let bins_demo = {
  1: 0,
  2: 0,
};

fs.readFile("Bin_level.json", (err, jsonBuffer) => {
  if (err) throw err;
  const jsonData = jsonBuffer.toString();
  bins_demo = JSON.parse(jsonData);
  console.log(bins_demo);
});

router.get("/Data", (req, res) => {
  try {
    res.status(200).json(bins_demo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post("/Data", async (req, res) => {
  try {
    const Data = req.body;

    // Payload:
    const Payload = Data.uplink_message.decoded_payload.payload;
    const result = Payload.split(":");
    // Device ID:
    const Device_ID = Data.end_device_ids.device_id;

    if (result[0] === "SETUP") {
      console.log("Setup");
      const postion = result[1].split(",");
      const lang = parseFloat(postion[0]);
      const lat = parseFloat(postion[1]);

      console.log(lang, lat);

      const bin = await Bins.find({ id: Device_ID });

      if (bin.length > 0) {
        if (bin[0].lat === lat && bin[0].lng === lang){
          res.status(200).json({ message: "Already Setup" });
          return;
        }else{
          await Bins.deleteOne({ id: Device_ID });
          console.log("UPDATING LOCATION")
        }
      }



      let data = [] 
      let city = null
      let neighbors = null
      let street = null


      const googlemap = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lang}&key=AIzaSyCNDdSRlhpTqVPruCPxR2xf4Zq8GNdry_s&language=en&result_type=political|sublocality|route`
      ).catch((err) => {
        console.log("ERROR in Getting Loocation Data , SETTING TO NULL")
        data = null 
      });

      if (data !== null) {
      data = googlemap.data.results[0];
       street =
        (data.address_components && data.address_components[0]?.short_name) ??
        null;
       neighbors =
        (data.address_components && data.address_components[1]?.short_name) ??
        null;
       city =
        (data.address_components && data.address_components[2]?.short_name) ??
        null;

      }

      await Bins.insertMany({
        id: Device_ID,
        lat: lat,
        lng: lang,
        city: city,
        neighborhood: neighbors,
        street: street,
      });

      

      bins_demo[Device_ID] = 0;
      console.log(bins_demo);
      res.status(200).json({ message: "Setup" });
      const jsonData = JSON.stringify(bins_demo);
      fs.writeFile("Bin_level.json", jsonData, (err) => {
        if (err) throw err;
        console.log("Data written to file");
      });

      return;
    } else if (result[0] === "UPDATE") {
      console.log("Update");
      const level = parseInt(result[1]);
      console.log(level);
      bins_demo[Device_ID] = level;
      console.log(bins_demo);
      const jsonData = JSON.stringify(bins_demo);
      fs.writeFile("Bin_level.json", jsonData, (err) => {
        if (err) throw err;
        console.log("Data written to file");
      });

      res.status(200).json({ message: "Update" });
      return;
    }

    res.status(200).json({ message: "Not Update" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
