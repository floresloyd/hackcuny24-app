# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


To run https flask server locally, you should run the following:
-     openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

You should have gotten prompted to create the key files with new information. Follow the prompts based on your information.

Now, you can enter the key.pem file and the server.pem file into the server.py file on line inside the 'app.run()' function at the bottom of the file
-     app.run(debug=True, port=8080, ssl_context=('server.pem', 'key.pem'))  # EDIT THIS to match server.py


