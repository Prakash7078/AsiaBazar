import Sidebar from "../../Components/Sidebar";
import { Card, Typography } from "@material-tailwind/react";

function AdminHome() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pt-10 lg:pl-72 p-4">
        <Typography variant="h3" color="blue-gray" className="mb-6">
          Admin Dashboard
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Users Count */}
          <Card className="p-6 shadow-md bg-white">
            <Typography variant="h5" color="gray">
              Total Users
            </Typography>
            <Typography variant="h2" color="blue" className="mt-2">
              250
            </Typography>
          </Card>

          {/* Products Count */}
          <Card className="p-6 shadow-md bg-white">
            <Typography variant="h5" color="gray">
              Total Products
            </Typography>
            <Typography variant="h2" color="blue" className="mt-2">
              120
            </Typography>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
