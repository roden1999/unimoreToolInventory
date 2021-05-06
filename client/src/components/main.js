import React, { useState, useEffect, useContext } from 'react'
import { Menu, Grid, Segment, Icon, Image, Button } from 'semantic-ui-react'
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
  const [page, setPage] = useState("TOOLS");
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
    sessionStorage.setItem("page", "TOOLS");
    // Storage.empty();
  }

  return (
    <Grid style={{ width: '100%', }}>
      <Grid.Column width={3} style={{ height: '100%', }}>
        <Menu inverted fluid vertical size='massive' style={{ height: '100%', minHeight: '100vh', maxHeight: '100vh' }}>

          <Menu.Item>
            <div style={{ alignItem: 'center', textAlign: 'center'}}>
            <Image src="unimore-logo.png"  />
            <p>{name}</p>
            <Button size='small' onClick={logOut}><Icon color='white' name='log out' />Logout</Button>
            </div>
          </Menu.Item>

          <Menu.Item
            active={page === 'SPARE PARTS'}
            onClick={() => handlePage("SPARE PARTS")}
            color="blue"
          >
            <h4><Icon color='white' name='microchip' /> Machine Spare Parts</h4>
          </Menu.Item>

          <Menu.Item
            active={page === 'TOOLS'}
            onClick={() => handlePage("TOOLS")}
            color="blue"
          >
            <h4><Icon color='white' name='gavel' /> Tools</h4>
          </Menu.Item>

          <Menu.Item
            active={page === 'CONSUMABLES'}
            onClick={() => handlePage("CONSUMABLES")}
          >
            <h4><Icon color='white' name='boxes' /> Consumables</h4>
          </Menu.Item>

          <Menu.Item
            active={page === 'RECORDS'}
            onClick={() => handlePage("RECORDS")}
          >
            <h4><Icon color='white' name='file alternate' /> Borrowed/Returned</h4>
          </Menu.Item>

          <Menu.Item
            active={page === 'FORMS'}
            onClick={() => handlePage("FORMS")}
          >
            <h4><Icon color='white' name='wpforms' /> Forms</h4>
          </Menu.Item>

          {
            <Menu.Item
              active={page === 'EMPLOYEES'}
              onClick={() => handlePage("EMPLOYEES")}
            >
              <h4><Icon color='white' name='users' /> Employees</h4>
            </Menu.Item>
          }

          {role === "Administrator" &&
            <Menu.Item
              active={page === 'MANAGE_USER'}
              onClick={() => handlePage("MANAGE_USER")}
            >
              <h4><Icon color='white' name='user circle' /> Users</h4>  
            </Menu.Item>
          }

          {/* <Menu.Item
            onClick={logOut}
            // style={{ marginTop: '195%', }}
            position="right"
          > trtrtr
            <h4><Icon color='white' name='log out' /> Logout</h4>
          </Menu.Item> */}
        </Menu>
      </Grid.Column>

      <Grid.Column stretched width={13}>
        <Segment style={{ marginTop: 20, height: '100%', minHeight: '95vh', maxHeight: '95vh' }}>
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
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default Main;
