import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Books from "./pages/OtherPage/Books";
import Facultets from "./pages/OtherPage/Faculty";
import Education from "./pages/OtherPage/Education";
import Tredtype from "./pages/OtherPage/Tredtype";
import Group from "./pages/OtherPage/Group";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth sahifa token talab qilmaydi */}
          <Route path="/signin" element={<SignIn />} />

          {/* Private routes */}
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/books-all" element={<Books />} />
              <Route path="/faculty" element={<Facultets />} />
              <Route path="/education" element={<Education />} />
              <Route path="/tredtype" element={<Tredtype />} />
              <Route path="/groups" element={<Group />} />
              <Route path="/books-create" element={<FormElements />} />
              <Route path="/category-all" element={<BasicTables />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}