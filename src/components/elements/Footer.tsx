import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-base text-gray-500">© 2025</span>
            <Link
              href="/"
              className="text-base font-medium text-primary hover:text-primary-600"
            >
              CiteSmart
            </Link>
          </div>

          <div className="flex space-x-6 text-base text-gray-500 order-3">
            Developed with 🔥 by&nbsp;
            <Link
              href="https://github.com/m-azzam-azis"
              target="_blank"
              className="text-primary hover:text-primary-600"
            >
              Azzam
            </Link>
          </div>
          <div className="flex space-x-6 text-gray-500">
            <span>Source code:&nbsp;</span>
            <Link
              href="https://github.com/m-azzam-azis/cite-smart-fe"
              target="_blank"
              className="text-gray-500 hover:text-primary transition-colors flex gap-2"
            >
              <IconBrandGithub className="size-6" />
              Front-end
            </Link>
            <Link
              href="https://github.com/m-azzam-azis/cite-smart-modus"
              target="_blank"
              className="text-gray-500 hover:text-primary transition-colors flex gap-2"
            >
              <IconBrandGithub className="size-6" />
              Back-end
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
