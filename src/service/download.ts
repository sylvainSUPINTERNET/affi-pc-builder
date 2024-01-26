import axios from "axios";
import path from "path";
import fs from "fs-extra";

export const downloadImage = async ( imgUrl: string, theme:string, imgName:string) => {

    let p = new URL(imgUrl).pathname.split("/");
    fs.ensureDirSync(path.join(__dirname, '..', '..', './images/'+ theme));
    const pathFile = path.join(__dirname, '..', '..', './images/'+ theme +"/"+ imgName+"@"+ p[p.length -1]);

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