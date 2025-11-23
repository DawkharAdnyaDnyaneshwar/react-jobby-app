import './index.css'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'IN-PROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobsApiStatus: apiStatusConstant.initial,
    jobList: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobList()
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: {id},
      },
    } = this.props

    const {
      match: {
        params: {id: prevId},
      },
    } = prevProps

    if (prevId !== id) {
      this.getJobList()
    }
  }

  getJobList = async () => {
    this.setState({jobsApiStatus: apiStatusConstant.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const job = data.job_details
      const updatedData = {
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
        skills: job.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: job.life_at_company.description,
          imageUrl: job.life_at_company.image_url,
        },
      }

      const updatedSimilarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobList: updatedData,
        similarJobs: updatedSimilarJobs,
        jobsApiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstant.failure})
    }
  }

  renderJobFailure = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-detail-failure-img"
      />
      <h2 className="job-detail-failure-heading">Oops! Something Went Wrong</h2>
      <p className="job-detail-failure-description">
        We cannot seen to find the page you are looking for.
      </p>
      <button className="retry-button" type="button" onClick={this.getJobList}>
        Retry
      </button>
    </>
  )

  renderJobSuccess = () => {
    const {jobList, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
      lifeAtCompany,
    } = jobList

    return (
      <div className="job-detail-container">
        <div className="job-detail-header-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="job-detail-company-logo"
          />
          <h2 className="job-detail-heading">{title}</h2>
          <p className="job-detail-rating">
            <AiFillStar className="job-detail-star" /> {rating}
          </p>
        </div>
        <div className="job-detail-main-point-description-container">
          <div className="job-detail-description-container">
            <MdLocationOn className="job-detail-icon" />
            <p className="job-detail-info">{location}</p>
          </div>
          <div className="job-detail-description-container">
            <BsBriefcaseFill className="job-detail-icon" />
            <p className="job-detail-info">{employmentType}</p>
          </div>
          <div className="job-detail-description-container">
            <p className="job-detail-info">{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="job-detail-hr-line" />
        <div className="job-detail-heading-container">
          <h2 className="job-detail-description-heading">Description</h2>
          <a
            href={companyWebsiteUrl}
            target="_blank"
            className="anchor-el"
            rel="noreferrer"
          >
            Visit <BsBoxArrowUpRight className="anchor-icon" />
          </a>
        </div>
        <p className="description">{jobDescription}</p>
        <h2 className="job-detail-heading">Skills</h2>
        <ul className="skills-container">
          {skills.map(eachSkill => (
            <li key={eachSkill.name} className="skills">
              <img
                src={eachSkill.imageUrl}
                alt={eachSkill.name}
                className="skill-image"
              />
              <p className="skill-name">{eachSkill.name}</p>
            </li>
          ))}
        </ul>
        <h2 className="job-detail-heading">Life at Company</h2>
        <div className="life-at-company-container">
          <p className="life-at-company-description">
            {lifeAtCompany.description}
          </p>
          <img
            src={lifeAtCompany.imageUrl}
            alt="life at company"
            className="life-at-company-img"
          />
        </div>
        <h2 className="job-detail-heading">Similar Jobs</h2>
        <ul className="similar-jobs-container">
          {similarJobs.map(eachJob => (
            <Link to={`/jobs/${eachJob.id}`} className="link-item">
              <li key={eachJob.id} className="similar-jobs">
                <div className="similar-jobs-header-container">
                  <img
                    src={eachJob.companyLogoUrl}
                    alt="similar job company logo"
                    className="similar-job-company-logo"
                  />
                  <h2 className="similar-job-heading">{eachJob.title}</h2>
                  <p className="similar-job-rating">
                    <AiFillStar className="similar-job-star" /> {eachJob.rating}
                  </p>
                </div>
                <h2 className="similar-job-heading">Description</h2>
                <p className="similar-jobs-description">
                  {eachJob.jobDescription}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  renderJobsSection = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstant.success:
        return this.renderJobSuccess()
      case apiStatusConstant.failure:
        return this.renderJobFailure()
      case apiStatusConstant.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    return this.renderJobsSection()
  }
}

export default JobItemDetails
