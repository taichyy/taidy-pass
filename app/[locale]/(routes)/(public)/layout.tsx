import Footer from "./(components)/footer";
import NavResponsive from "./(components)/navbar/nav-responsive";

const PublicLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        // Hide data-aos first inisialization x-bar.
        <div className="overflow-x-hidden">
            <NavResponsive />
            {children}
            <Footer />
        </div>
    );
}

export default PublicLayout;