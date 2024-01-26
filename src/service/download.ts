import axios from "axios";
import path from "path";
import fs from "fs";

export const downloadImage = async ( imgUrl: string ) => {

    let p = new URL(imgUrl).pathname.split("/");


    const pathFile = path.join(__dirname, '..', '..', './images/' + p[p.length -1]);

    console.log("Write to ", pathFile);

    const { data } = await axios.get(imgUrl, {
        "responseType": "stream"
    });

    return new Promise( (resolve, reject) => {
        data
            .pipe(fs.createWriteStream(pathFile))
            .on('error', reject)
            .on('close', resolve(pathFile));
    })
}