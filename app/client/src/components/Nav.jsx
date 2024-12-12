import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../App.css"
const Navigation = () => {
    return (
        <>
            {/* Navbar Component */}
            <Navbar expand="lg" className="custom-navbar" variant="dark">
                <Container>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">
                                Home
                            </Nav.Link>
                            {/* You can remove the 'Create' link from here */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Heading */}
            <h1 className="heading text-center mt-4">ICP RUST NFT MARKETPLACE</h1>

            {/* Create Button */}
            <div className="text-center">
                <Link to="/create">
                    <button className="btn btn-primary">Create</button>
                </Link>
            </div>
        </>
    );
};

export default Navigation;
