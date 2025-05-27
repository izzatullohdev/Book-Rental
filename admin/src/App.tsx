import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import FormElements from "./pages/Forms/FormElements";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import Books from "./pages/OtherPage/Books";
// import Education from "./pages/OtherPage/Direction";
// import Tredtype from "./pages/OtherPage/Tredtype";
import Auther from "./pages/OtherPage/Auther";
import Kafedra from "./pages/OtherPage/Kafedra";
import Direction from "./pages/OtherPage/Direction";
// import Category from "./pages/OtherPage/Category";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/books-all" element={<Books />} />
              <Route path="/auther" element={<Auther />} />
              <Route path="/kafedra" element={<Kafedra />} />
              <Route path="/direction" element={<Direction />}/>
              <Route path="/books-create" element={<FormElements />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
              {/* <Route path="/education" element={<Education />} /> */}
              {/* <Route path="/tredtype" element={<Tredtype />} /> */}
              {/* <Route path="/category-all" element={<Category />} /> */}
            </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}