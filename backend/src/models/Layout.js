import mongoose from "mongoose";

const layoutSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    objects: [
      {
        type: { type: String, required: true },
        position: {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
        },
        size: {
          width: { type: Number, required: true },
          height: { type: Number, required: true },
        },
        color: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Layout = mongoose.model("Layout", layoutSchema);
export default Layout;