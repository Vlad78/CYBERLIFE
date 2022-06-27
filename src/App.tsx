import { Provider } from "react-redux";
import "./App.scss";
import { store } from "./app/store";
import Playground from "./components/Playground";

function App() {
  return (
    <Provider store={store}>
      <div className="header">CYBER EVOLUTION</div>
      <Playground />
    </Provider>
  );
}

export default App;
