import qs from 'qs'

const FacebookButton = () => {
  const stringifiedParams = qs.stringify({
    client_id: '4745740692193492',
    redirect_uri: `${
      typeof window !== 'undefined' ? location.origin : ''
    }/auth/facebook`,
    scope: 'email', // comma seperated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
  })

  const oauthLink = `https://www.facebook.com/v13.0/dialog/oauth?${stringifiedParams}`

  return (
    <a
      onClick={() =>
        window.open(
          oauthLink,
          'targetWindow',
          'scrollbars=yes,resizable=yes,width=700,height=500'
        )
      }
      className="inline-flex w-full cursor-pointer justify-center space-x-2 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5"
      >
        <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z" />
        <path
          fill="#fff"
          d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
        />
      </svg>
      <span>{'Facebook'}</span>
    </a>
  )
}

FacebookButton.displayName = 'Button';

export default FacebookButton;
