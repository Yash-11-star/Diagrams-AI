import Link from "next/link";
export default function Footer() {
    <footer className="border-t border-apple-border bg-apple-light-gray/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
              <div className="w-7 h-7 bg-apple-blue rounded-lg flex items-center justify-center">
                  <path d="M3 9h12M9 3v12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </div>
            </div>
              Yash Tembhurnikar
          </div>
          {}
            <a href="#features" className="hover:text-apple-dark transition-colors">Features</a>
            <Link href="/login" className="hover:text-apple-dark transition-colors">Sign in</Link>
          </div>

          <p className="text-[12px] text-apple-gray">
          </p>
            <span>Powered by</span>
            <span>&amp;</span>
          </div>
      </div>
  );
