import React, { memo } from 'react';
import PropTypes from 'prop-types';

const HubIcon = ({ colour }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 550 550'
      style={{ fill: colour }}
    >
      <path
        d='M885 5050c-191-39-352-181-417-369l-23-66V885l23-68c44-126 147-249 262-311 27-15 83-35 126-46 76-20 117-20 1894-20s1818 0 1894 20c108 27 170 63 251 145 82 82 118 144 145 251 20 76 20 117 20 1894s0 1818-20 1894c-25 97-59 160-126 235-63 69-129 114-222 150l-67 26-1850 1c-1017 1-1868-2-1890-6zm3757-237c66-30 133-96 165-162l28-56V905l-22-47c-30-66-96-133-162-165l-56-28H905l-56 28c-66 32-132 99-162 165l-22 47-3 1825c-2 2014-6 1884 61 1971 45 59 98 99 159 120 51 18 131 18 1883 16l1830-2 47-22z'
        transform='matrix(.1 0 0 -.1 0 550)'
      ></path>
      <path
        d='M2641 4494c-217-58-360-276-324-490 25-147 134-286 262-335l61-24v-463l-52-17c-113-37-217-113-279-204-19-28-39-49-45-47s-97 32-202 65l-192 62v33c0 161-100 325-240 396-264 133-582-27-632-318-40-237 124-463 366-505 133-23 259 20 372 126l65 60 197-64 197-65 7-85c8-109 38-197 94-281 31-46 43-72 37-82-4-8-73-105-153-215-121-168-148-200-165-195-130 35-233 28-344-27-122-60-209-179-233-317-31-183 62-371 228-459 274-145 608 35 641 346 8 80-19 193-62 265l-34 57 156 215c121 166 160 213 172 208 48-21 154-43 211-43s163 22 211 43c12 5 51-42 172-209l157-215-25-39c-175-264-18-620 299-674 181-31 374 69 456 236 133 271-26 579-325 630-61 10-130 5-210-17-17-5-44 27-165 195-80 110-149 207-153 215-6 10 6 36 37 82 56 84 86 172 94 282l7 84 198 65 197 64 65-62c143-137 327-167 502-81 166 82 267 276 236 456-47 276-328 441-585 344-161-60-268-203-284-380l-7-70-190-61c-105-34-195-63-201-65s-26 19-45 47c-62 91-166 167-278 204l-53 17v234c0 189 3 234 13 234 35 0 139 65 191 120 98 102 141 236 119 366-44 258-296 424-542 358zm225-240c68-42 107-117 102-196-12-168-191-261-334-172-68 42-107 117-102 196 12 168 191 261 334 172zm-1320-990c70-43 108-117 101-197-7-83-46-143-117-180-48-25-63-28-113-24-170 15-260 190-171 333 63 103 196 133 300 68zm2640 0c68-42 107-117 102-196-12-168-191-261-334-172-68 42-107 117-102 196 12 168 191 261 334 172zm-1304-321c65-30 133-95 165-162 37-75 40-200 6-273-30-66-96-133-162-165-48-24-68-28-141-28s-93 4-141 28c-223 109-253 402-57 560 85 68 227 85 330 40zm-896-1329c68-42 107-117 102-196-12-168-191-261-334-172-68 42-107 117-102 196 12 168 191 261 334 172zm1760 0c68-42 107-117 102-196-12-168-191-261-334-172-68 42-107 117-102 196 12 168 191 261 334 172z'
        transform='matrix(.1 0 0 -.1 0 550)'
      ></path>
    </svg>
  );
};

HubIcon.propTypes = {
  colour: PropTypes.string
};

export const HubIconSvg = memo(HubIcon);
