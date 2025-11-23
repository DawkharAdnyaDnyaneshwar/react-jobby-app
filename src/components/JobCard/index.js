import './index.css'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

const JobCard = props => {
  const {jobDetail} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetail
  return (
    <Link to="/jobs/:id">
      <li className="job-container">
        <div className="job-header-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <h2 className="job-heading">{title}</h2>
          <p className="rating">
            <AiFillStar className="star" /> {rating}
          </p>
        </div>
        <div className="main-point-description-container">
          <div className="description-container">
            <MdLocationOn className="icon" />
            <p className="info">{location}</p>
          </div>
          <div className="description-container">
            <BsBriefcaseFill className="icon" />
            <p className="info">{employmentType}</p>
          </div>
          <div className="description-container">
            <p className="info">{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="job-hr-line" />
        <h2 className="job-description-heading">Description</h2>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
