import React, { useEffect } from "react";
import { MatchPrinter, studentAPI } from "../../axios/student";

const Login: React.FC = () => {
  useEffect(() => {
    const fetch = async () => {
      const response: MatchPrinter[] | undefined =
        await studentAPI.getMatchPrinters("A4", 1, 1, false, true);
      console.log(response);
    };
    fetch();
  }, []);
  return <div>test</div>;
};

export default Login;
