import React from "react";

const NewsLater = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-accent py-16 px-4 md:px-10 text-white rounded-2xl mb-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Join Our Newsletter</h2>
          <p className="text-lg opacity-90">
            Stay updated with fitness tips, exclusive classes, and community
            updates. Subscribe now and never miss a beat!
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <input
              type="text"
              placeholder="Your Name"
              className="input w-full md:w-1/3 text-black"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="input w-full md:w-1/3 text-black"
            />
            <button className="btn btn-secondary font-bold uppercase tracking-widest">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default NewsLater;
