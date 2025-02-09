import { Icon28AddCircle } from "@telegram-apps/telegram-ui/dist/icons/28/add_circle"
import { Icon28Home } from "@/iclons/Home";
import { Icon28Search } from "@/iclons/Search"
import { Icon28Profile } from "@/iclons/Profile";

export function NavBar() {
    const navBarStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-around', // Распределяем кнопки равномерно
      alignItems: 'center',
      width: '100%',
      padding: '10px 0',
      backgroundColor: '#f2f2f2',
      position:'absolute',
      bottom: 0,
    };
  
    const buttonStyle: React.CSSProperties = {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      outline: 'none',
    };
  
    return (
      <div style={navBarStyle}>
        <button style={buttonStyle}>
          <Icon28Home />
        </button>
        <button style={buttonStyle}>
          <Icon28Search />
        </button>
        <button style={buttonStyle}>
          <Icon28AddCircle />
        </button>
        <button style={buttonStyle}>
          <Icon28Profile />
        </button>
      </div>
    );
  }
  