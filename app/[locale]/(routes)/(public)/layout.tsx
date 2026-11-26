import Footer from "./(components)/footer";
import NavResponsive from "./(components)/navbar/nav-responsive";

const PublicLayout = (props: {
    children: React.ReactNode;
}) => {
    const { children } = props;

    return (
        // Hide data-aos first inisialization x-bar.
        <div className="overflow-x-hidden">
            <NavResponsive />
            {children}
            <Footer />
        </div>
    );
};

export default PublicLayout;