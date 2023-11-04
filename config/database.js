import mongoose from "mongoose";

export const connection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://adhilmuhammed:adhilMuhammed123@cluster0.umo5dlc.mongodb.net/?retryWrites=true&w=majority"
    );
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("mongodb connected successfully");
    });

    connection.on("error", (err) => {
      console.log("mongodb connection error:" + err);
      process.exit();
    });
  } catch (error) {
    console.log("error: ", error);
  }
};
