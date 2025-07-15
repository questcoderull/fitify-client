import { FaDumbbell, FaRunning, FaUsers, FaCalendarAlt } from "react-icons/fa";

const features = [
  {
    id: 1,
    title: "Expert Trainers",
    description:
      "Get access to certified and experienced trainers who guide you on every step of your fitness journey.",
    icon: <FaDumbbell />,
  },
  {
    id: 2,
    title: "Variety of Classes",
    description:
      "Choose from yoga, cardio, strength training, and more to keep your workouts fresh and exciting.",
    icon: <FaRunning />,
  },
  {
    id: 3,
    title: "Community Support",
    description:
      "Join a community of like-minded individuals, share your progress, and stay motivated together.",
    icon: <FaUsers />,
  },
  {
    id: 4,
    title: "Flexible Scheduling",
    description:
      "Flexible class schedules to fit your lifestyle, making it easy to stay consistent with your goals.",
    icon: <FaCalendarAlt />,
  },
];

const FeatureSection = () => {
  return (
    <section className=" my-16">
      <h2 className="text-4xl text-primary font-bold text-center mb-10">
        Why Choose Us?
      </h2>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ id, title, description, icon }) => (
          <div
            key={id}
            className="card shadow-lg border border-base-300 p-6 hover:shadow-xl transition rounded-xl"
          >
            <div className="flex justify-center mb-4 text-4xl  text-primary">
              {icon}
            </div>
            <h3 className="text-2xl font-semibold text-center mb-2 text-secondary">
              {title}
            </h3>
            <p className="text-center text-primary">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
