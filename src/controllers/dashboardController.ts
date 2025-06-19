import { getDB } from "../utils/dbUtils";

// Get All Dashboard Data
const getAll = async (req: any, res: any) => {
  try {
    const db = getDB();

    res.json({
      status: true,
      message: "Dashboard data fetched successfully",
      data: {
        dashboard: db.dashboard,
        userDistribution: db.userDistribution,
        stateDistribution: db.stateDistribution,
        trendingContent: db.trendingContent,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export default { getAll };
