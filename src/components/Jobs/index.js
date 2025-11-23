import './index.css'

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'

import Header from '../Header'
import JobCard from '../JobCard'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'IN-PROGRESS',
  failure: 'FAILURE',
}

class Job extends Component {
  state = {
    profileApiStatus: apiStatusConstant.initial,
    jobsApiStatus: apiStatusConstant.initial,
    profileDetail: {},
    jobList: [],
    employmentType: [],
    salaryRange: '',
    searchValue: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobList()
  }

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstant.loading})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetail: updatedData,
        profileApiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstant.failure})
    }
  }

  renderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstant.success:
        return this.renderProfileSuccess()
      case apiStatusConstant.failure:
        return this.renderProfileFailure()
      case apiStatusConstant.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderProfileSuccess = () => {
    const {profileDetail} = this.state
    return (
      <div className="profile-container">
        <img
          src={profileDetail.profileImageUrl}
          alt="profile"
          className="profile-image"
        />
        <h3 className="profile-name">{profileDetail.name}</h3>
        <p className="short-bio">{profileDetail.shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <button className="retry-button" type="button" onClick={this.getProfile}>
      Retry
    </button>
  )

  getJobList = async () => {
    this.setState({jobsApiStatus: apiStatusConstant.loading})
    const {employmentType, salaryRange, searchValue} = this.state
    const updatedEmploymentType = employmentType.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${updatedEmploymentType}&minimum_package=${salaryRange}&search=${searchValue}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.jobs.map(eachJob => ({
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
        className="failure-img"
      />
      <h2 className="failure-heading">Oops! Something Went Wrong</h2>
      <p className="failure-description">
        We cannot seen to find the page you are looking for.
      </p>
      <button className="retry-button" type="button" onClick={this.getJobList}>
        Retry
      </button>
    </>
  )

  renderJobSuccess = () => {
    const {jobList} = this.state
    return jobList.length === 0 ? (
      <div className="no-job-found-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no job"
          className="no-job-image"
        />
        <h2 className="no-job-heading">No Jobs Found</h2>
        <p className="no-job-description">
          We could not find any jobs. Try other filters
        </p>
      </div>
    ) : (
      <ul className="jobs-container">
        {jobList.map(eachJob => (
          <JobCard key={eachJob.id} jobDetail={eachJob} />
        ))}
      </ul>
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

  searchJob = () => {
    this.getJobList()
  }

  changeSearchValue = event => {
    this.setState({searchValue: event.target.value})
  }

  changeEmploymentType = event => {
    const {employmentType} = this.state
    const selected = event.target.value

    if (employmentType.includes(selected)) {
      const updatedType = employmentType.filter(each => each !== selected)
      this.setState({employmentType: updatedType}, this.getJobList)
    } else {
      this.setState(
        {employmentType: [...employmentType, selected]},
        this.getJobList,
      )
    }
  }

  changeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobList)
  }

  renderJobPageSection = () => {
    const {searchValue} = this.state
    return (
      <>
        <Header />
        <div className="jobs-section">
          <div className="input-el-container">
            <input
              type="search"
              value={searchValue}
              className="search-input-el"
              onChange={this.changeSearchValue}
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={this.searchJob}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="filter-section">
            {this.renderProfile()}
            <hr className="hr-line" />
            <h2 className="employment-heading">Type of Employment</h2>
            <ul>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    value={each.employmentTypeId}
                    onChange={this.changeEmploymentType}
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              ))}
            </ul>
            <hr className="hr-line" />
            <h2 className="employment-heading">Salary Range</h2>
            <ul>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="radio"
                    id={each.salaryRangeId}
                    value={each.salaryRangeId}
                    onChange={this.changeSalaryRange}
                  />
                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>
          <div className="search-job-container">
            <div className="input-el-container">
              <input
                type="search"
                value={searchValue}
                className="search-input-el"
                onChange={this.changeSearchValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.searchJob}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsSection()}
          </div>
        </div>
      </>
    )
  }

  render() {
    return this.renderJobPageSection()
  }
}

export default Job
