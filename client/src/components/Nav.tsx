import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #f5f5f5;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
`;

const Links = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
`;

const Link = styled.li`
  margin: 0 10px;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.5px;

  & > a {
    text-decoration: none;
    color: #333;

    &:hover {
      color: #666;
    }
  }
`;

export function Navbar() {
  return (
    <Nav>
      <Logo>Stream</Logo>
      <Links>
        <Link><a href="/">Home</a></Link>
        <Link><a href="/login">Login</a></Link>
        <Link><a href="/register">Register</a></Link>
      </Links>
    </Nav>
  );
}
