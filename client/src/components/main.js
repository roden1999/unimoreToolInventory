import React, { useState, useEffect, useContext } from 'react'
import { Menu, Grid, Segment, Icon, Image, Button, Dropdown, Card } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

//Components
import MachineSpareParts from './machineSpareParts';
import Tools from './tools';
import Consumables from './consumables';
import Records from './records';
import Employees from './employees';
import Projects from './projects';
import Forms from './forms';
import Users from './user';
import UserContext from './context/userContext';

const Main = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [page, setPage] = useState("MENU");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const data = sessionStorage.getItem('page');
    if (data) setPage(data);

    const user = JSON.parse(sessionStorage.getItem('user'));
    setRole(user.role);
    setName(user.Name);
  }, []);
  useEffect(() => {
    sessionStorage.setItem('page', page);
  });

  const handlePage = (value) => {
    setPage(value);
  }

  const logOut = () => {
    setUserData({
      token: undefined,
      user: undefined
    });
    sessionStorage.setItem("auth-token", "");
    sessionStorage.setItem("userData", "");
    sessionStorage.setItem("user", "");
    sessionStorage.setItem("page", "MENU");
    // Storage.empty();
  }

  return (
    <div style={{ width: '100%', }}>
      <Menu stackable inverted fixed style={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <Menu.Item>
        <img src="unimore-logo.png" /> {" Unimore Trading"}
        </Menu.Item>

        <Menu.Menu position="right">
          {page !== "MENU" &&
            <Menu.Item onClick={() => handlePage("MENU")}>
              <Icon color='white' name='th large' /> Menu
            </Menu.Item>
          }
          <Dropdown item text={name}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={logOut}><Icon color='white' name='log out' /> Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>

      <div style={{ paddingLeft: 30, paddingRight: 30 }}>
        <Segment style={{ height: '100%', minHeight: '95vh', maxHeight: '95vh' }}>
          {page === "SPARE PARTS" && role !== "Tool Keeper" &&
            <MachineSpareParts />
          }
          {page === "TOOLS" &&
            <Tools />
          }
          {page === "CONSUMABLES" &&
            <Consumables />
          }
          {page === "RECORDS" &&
            <Records />
          }
          {page === "EMPLOYEES" &&
            <Employees />
          }
          {page === "FORMS" &&
            <Forms />
          }
          {page === "MANAGE_USER" && role === "Administrator" &&
            <Users />
          }
          {page === "MENU" &&
            <Card.Group itemsPerRow={4}>
              {role !== "Tool Keeper" &&
                <Card
                  link
                  header={<h1>MACHINE SPARE PARTS</h1>}
                  style={{ minHeight: "20vh", backgroundImage: `url("spareparts.png")`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}
                  onClick={() => handlePage("SPARE PARTS")}
                  color="blue"
                />
              }

              <Card
                link
                header={<h1>TOOLS</h1>}
                style={{ minHeight: "20vh", backgroundImage: `url("tools.png")`, backgroundSize: "cover", backgroundRepeat: "no-repeat", }}
                onClick={() => handlePage("TOOLS")}
                color="blue"
              />

              <Card
                link
                header={<h1>CONSUMABLES</h1>}
                style={{ minHeight: "20vh", backgroundImage: `url("consumables.jpg")`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
                onClick={() => handlePage("CONSUMABLES")}
                color="blue"
              />

              <Card
                link
                header={<h1 style={{ backgroundColor: 'white' }}>BORROWED / RETURNED</h1>}
                style={{ minHeight: "20vh", backgroundImage: `url("records.jpeg")`, backgroundSize: "cover", backgroundRepeat: "no-repeat", }}
                onClick={() => handlePage("RECORDS")}
                color="blue"
              />

              <Card
                link
                header={<h1>PROJECTS</h1>}
                style={{ minHeight: "20vh", backgroundImage: `url("projects.jpg")`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
                onClick={() => handlePage("FORMS")}
                color="blue"
              />

              <Card
                link
                header={<h1>EMPLOYEES</h1>}
                style={{ minHeight: "20vh", backgroundImage: `url("employees.png")`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
                onClick={() => handlePage("EMPLOYEES")}
                color="blue"
              />

              {role === "Administrator" &&
                <Card
                  link
                  header={<h1>USERS</h1>}
                  style={{ minHeight: "20vh", backgroundImage: `url("users.png")`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
                  onClick={() => handlePage("MANAGE_USER")}
                  color="blue"
                />
              }
            </Card.Group>
          }
        </Segment>
      </div>
    </div >
  );
}

export default Main;
