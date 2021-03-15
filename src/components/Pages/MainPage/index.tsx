import { observer } from "mobx-react";

const MainPage = observer(() => (
  <div className="row justify-content-center align-items-center">
    <div className="col d-flex flex-column justify-content-center align-items-center m-4">
      <h1 className="text-secondary"> {`Main Page`} </h1>
    </div>
  </div>
));

export default MainPage;
