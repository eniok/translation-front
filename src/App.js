import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Documents from './Screens/Documents';
import Document from './Screens/Document';
import awsExports from './Config/Aws'
import App from './Screens/App/App';
import './App.css';

Amplify.configure(awsExports);

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/document/:id",
      element: (<Document />),
    },
    {
      path: "/documents",
      element: (<Documents />),
    },
    {
      path: '*',
      element: (<App />)
    }
  ]);

  return (
    <RouterProvider
      router={router}
    />
  )
}

export default withAuthenticator(Router, {
  hideSignUp: true
});
