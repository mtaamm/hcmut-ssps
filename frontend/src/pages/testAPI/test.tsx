import React, { useEffect } from "react";
import { GetPrinterDetailResponse, spsoAPI } from "../../axios/spso";

const Login: React.FC = () => {
  useEffect(() => {
    const fetch = async () => {
      const response: GetPrinterDetailResponse | undefined =
        await spsoAPI.getPrinterDetail("040d07d6-d1a9-410f-aca7-dc493ed8296e");
      console.log(response);
    };
    fetch();
  }, []);
  return <div>test</div>;
};

export default Login;
