import React from 'react';

const departmentData = {
    "School of Architecture": [
        "B. Architecture"
    ],
    "School of Allied & Healthcare Sciences": [
        "Bachelor of Optometry",
        "Bachelor of Science (Hons.) (Medical Laboratory Technology) (MLT)",
        "Bachelor of Science (Hons.) (Hospital Administration) (HA)",
        "Bachelor in Anaesthesia and Operation Theatre Technology (AOTT)",
        "Bachelor in Medical Radiology and Imaging Technology (MRIT)"
    ],
    "School of Design": [
        "B.Des. Bachelor of Communication Design",
        "B.Des. Bachelor of Product Design",
        "Bachelor of Design | Fashion Design",
        "Bachelor of Design | Interior Design",
        "Bachelor of Science | Sound Engineering",
        "Bachelor of Science | Visual Effects and Animation B.Sc. | VFX"
    ],
    "School of Economics and Commerce": [
        "Bachelor of Commerce | B.Com",
        "B.Com. | Professional CA-Integrated",
        "B.Com. | International Accounting & Finance (ACCA, UK)",
        "Bachelor of Commerce | Data Science",
        "Bachelor of Commerce | Certified Management Accountant (US CMA)"
    ],
    "School of Engineering and Technology (SOET)": [
        "Bachelor of Technology | B.Tech.| CSE",
        "Bachelor of Technology | B.Tech.| AI & ML",
        "Bachelor of Technology | B.Tech. CSE | DS",
        "Bachelor of Technology | B.Tech. IT",
        "B.Tech.| CST* (with Specialisation in AI & ML/ Internet Of Things) IT. ECE",
        "Bachelor of Technology | B.Tech. ECE",
        "B.Tech. Computer Engg (Specialisation in AIML & IoT)",
        "M.Tech.| Computer Science & Engineering (CSE)",
        "M.Tech. Artificial Intelligence (AI)"
    ],
    "School of Legal Studies": [
        "B.A., LL.B. (Hons.)",
        "B.B.A., LL.B. (Hons)",
        "LL.B.",
        "LL.M. | Constitutional Law",
        "LL.M. | Commercial Law",
        "LL.M. | Criminal Law"
    ],
    "School of Liberal Studies": [
        "B.A. (Major + Minor) Psychology | English | Journalism | Economics | Political Science | History | Sociology | Media Studies | Travel & Tourism",
        "B.Sc. | Psychology",
        "M.Sc. Psychology | Clinical",
        "M.Sc. Psychology | Counselling",
        "M.Sc. Psychology | HRDM"
    ],
    "School of Management": [
        "BBA",
        "BBA | Digital Marketing (DM)",
        "BBA | BA (business analytics)",
        "BBA | Fintech",
        "BBA | Date Science",
        "BBA | Logistics & SCM",
        "BBA | Tourism & Hospitality Management",
        "MBA | with Dual Specialisation",
        "MBA | Technology Management",
        "MBA | Business Analytics & Business Intelligence| BA & BI",
        "E-MBA | Product Leadership"
    ],
    "School of Science & Computer Studies": [
        "BCA (Bachelor of Computer Applications)",
        "BCA | Data Science",
        "BCA | Cloud Computing",
        "BCA | Game development",
        "BCA (AI & ML)",
        "B.Sc. Information Technology",
        "MCA",
        "M.Sc. Information Technology in Data Science"
    ]
};

export function Step1Type({ formData, updateFormData }) {
    const handleDepartmentChange = (e) => {
        const selectedDept = e.target.value;
        updateFormData({ department: selectedDept, course: '' }); // Reset course when dept changes
    };

    const currentCourses = formData.department ? departmentData[formData.department] : [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Incident Basics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Type of Incident <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.incidentType}
                        onChange={(e) => updateFormData({ incidentType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                        <option value="">Select an incident type</option>
                        <option value="Bullying">Bullying</option>
                        <option value="Harassment">Harassment</option>
                        <option value="Discrimination">Discrimination</option>
                        <option value="Safety Hazard">Safety Hazard</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {formData.incidentType === 'Other' && (
                    <div className="col-span-1 md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Please specify the incident type <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Briefly describe the incident type"
                            value={formData.otherIncidentType || ''}
                            onChange={(e) => updateFormData({ otherIncidentType: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                )}

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Department/School
                    </label>
                    <select
                        value={formData.department || ''}
                        onChange={handleDepartmentChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                        <option value="">Select Department (Optional)</option>
                        {Object.keys(departmentData).map((dept, idx) => (
                            <option key={idx} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                {formData.department && currentCourses && currentCourses.length > 0 && (
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Course
                        </label>
                        <select
                            value={formData.course || ''}
                            onChange={(e) => updateFormData({ course: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                            <option value="">Select Course (Optional)</option>
                            {currentCourses.map((courseOption, idx) => (
                                <option key={idx} value={courseOption}>{courseOption}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Date of Incident <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => updateFormData({ date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Time (Approximate)
                    </label>
                    <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => updateFormData({ time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Science Lab, Corridor B, Playground"
                        value={formData.location}
                        onChange={(e) => updateFormData({ location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
