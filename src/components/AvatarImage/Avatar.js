import './Avatar.scss';

export const Avatar = ({ src, name, isVerified, isActive, ...rest }) => {
  let active = <span className="Active"></span>;

  return (
    <span className="Avatar">
      {isActive && active}
      {isVerified ? (
        <svg
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          className="kirk-avatar-mask"
          data-testid="verified-mask"
        >
          <g clipPath="url(#clip0_3378_48529)">
            <circle
              cx="24"
              cy="24"
              r="22.5"
              stroke="white"
              stroke-width="3"
              fill="none"
            ></circle>
            <circle
              cx="24"
              cy="24"
              r="23"
              stroke="#00AFF5"
              stroke-width="2"
              fill="none"
            ></circle>
            <path
              d="M39.9436 30.8783C39.4179 30.3739 38.5821 30.3739 38.0564 30.8783C37.0859 31.8097 36.3263 32.3987 35.4938 32.8409C34.6567 33.2856 33.6955 33.6087 32.2858 33.9469C31.7036 34.0865 31.25 34.6054 31.25 35.25C31.25 38.1474 31.7528 40.6616 32.9358 42.7295C34.129 44.8153 35.9669 46.3639 38.4797 47.3973C38.8127 47.5342 39.1873 47.5342 39.5203 47.3973C42.0331 46.3639 43.871 44.8153 45.0642 42.7295C46.2472 40.6616 46.75 38.1474 46.75 35.25C46.75 34.6054 46.2964 34.0865 45.7142 33.9469C44.3045 33.6087 43.3433 33.2856 42.5062 32.8409C41.6737 32.3987 40.9141 31.8097 39.9436 30.8783Z"
              fill="#00AFF5"
              stroke="white"
              stroke-width="2"
            ></path>
            <path
              d="M42.2224 36.9189C42.0113 36.6937 41.663 36.6937 41.452 36.9189L37.9637 40.6416L36.5467 39.1689C36.3355 38.9452 35.9882 38.9457 35.7777 39.1704C35.5741 39.3876 35.5741 39.7342 35.7776 39.9514L37.5822 41.8324C37.7934 42.0563 38.1407 42.0559 38.3514 41.8311L42.2224 37.6999C42.4259 37.4827 42.4259 37.1361 42.2224 36.9189Z"
              fill="white"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_3378_48529">
              <rect width="48" height="48" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
      ) : (
        <></>
      )}
      {src ? (
        <img
          className="Image"
          alt={name}
          src={src}
          id="avatar-image"
          referrerPolicy="no-referrer"
          {...rest}
        />
      ) : (
        <span className="Name" {...rest}>
          {name}
        </span>
      )}
    </span>
  );
};
