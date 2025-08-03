import mongoose from "mongoose"

export interface IScanLog extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  toolName: string
  input: string
  output: string
  status: "success" | "error" | "timeout"
  executionTime: number
  createdAt: Date
}

const scanLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toolName: {
      type: String,
      required: true,
      enum: ["nmap", "sublist3r", "nikto", "whois", "dig", "curl"],
    },
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "error", "timeout"],
      required: true,
    },
    executionTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.ScanLog || mongoose.model<IScanLog>("ScanLog", scanLogSchema)
