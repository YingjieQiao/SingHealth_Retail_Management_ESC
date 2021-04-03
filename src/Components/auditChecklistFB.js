import React, { Component } from 'react';
import axios from "axios";

class AuditChecklistFB extends Component {

    // TODO: Add more auditors

    // q1: 13
    // q2: 17
    // q3: 37
    // q4: 11
    // q5: 18
    state = { 
        // 34 qn + 1 comment + 3 dropdown
        dataLength: 100,
        auditorName: "",
        auditorDepartment: "",
        auditeeName: "",
        profStaffHydScore: 0,
        housekeepScore: 0,
        foodHydScore: 0,
        healthierScore: 0,
        workSafetyHealthScore: 0,
        totoalScore: 0,
        scoreDict: {},
        finalDict: {
            comment: ""
        },
        comment: "",
        auditeeArray: [],
        numOfAuditee: []
    }

    componentDidMount() {
        axios.get("http://localhost:5000/tenant_list_FB")
        .then(
            res => {
                console.log(res);

                for (var i = 0; i < res.data.tenant_list.length; i++) {
                    let newArray1 = this.state.auditeeArray;
                    let newArray2 = this.state.numOfAuditee;
                    newArray1.push(res.data.tenant_list[i]);
                    newArray2.push(i);
                    this.setState({auditeeArray: newArray1, numOfAuditee: newArray2});
                }

            }
        )
    }

    render() {

        return (
            <div>                
                <h2>New Audit</h2>
                <h2>Audit Checklist (Non-F&#38;B)</h2>
                <form>
                    <div>
                        <label>Auditee:</label>
                        <select class="custom-select my-1 mr-sm-2" onChange={this.saveAuditee}>
                            <option selected>Choose...</option>
                            { this.state.numOfAuditee.map(index => <option value={index.toString()}>{this.handleAuditee(index)}</option> ) }
                        </select>
                    </div>
                    <div>
                        <label>Auditor:</label>
                        <select class="custom-select my-1 mr-sm-2" id="auditorName" onChange={this.handleAuditor}>
                            <option selected value="-1">Choose...</option>
                            <option value="Tom">Tom</option>
                            <option value="Jerry">Jerry</option>
                            <option value="Charlie">Charlie</option>
                        </select>
                    </div>
                    <div>
                        <label>Auditor's Department:</label>
                        <select class="custom-select my-1 mr-sm-2" id="auditorDepartment" onChange={this.handleDepartment}>
                            <option selected value="-1">Choose...</option>
                            <option value="CSR">CSR</option>
                            <option value="HR">HR</option>
                            <option value="Risk">Risk</option>
                        </select>
                    </div>

                    <h3>1. Professionalism &#38; Staff Hygiene (10%)</h3>
                    <h4>Professionalism</h4>
                    <div class="form-group">
                        <label>Shop is open and ready to service patients/visitors according to operating hours.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="001" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Staff Attendance: adequate staff for peak and non-peak hours.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="002" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>At least one (1) clearly assigned person in-charge on site.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="003" onInput={this.saveScore}/>
                    </div>


                    <h4>Staff Hygiene</h4>
                    <div class="form-group">
                        <label>Staff who are unfit for work due to illness should not report to work.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="004" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Staff who are fit for work but suffering from the lingering effects of a cough and/or cold should cover their mouths with a surgical mask.</label>
                        <input type="number"  min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="005" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Clean clothes/uniform or aprons are worn during food preparation and food service.</label>
                        <input type="number"  min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="006" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Hair is kept tidy (long hair must be tied up) and covered with clean caps or hair nets where appropriate.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="007" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Sores, wounds or cuts on hands, if any, are covered with waterproof and brightly-coloured plaster.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="008" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Hands are washed thoroughly with soap and water, frequently and at appropriate times.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="009" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Fingernails are short, clean, unpolished and without nail accessories.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="010" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>No wrist watches/ rings or other hand jewellery (with exception of wedding ring) is worn by staff handling food.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="011" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food is handled with clean utensils and gloves.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="012" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Disposable gloves are changed regularly and/ or in between tasks.</label>
                        <ul>
                            <li key="013">Staff do not handle cash with gloved hands.</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="013" onInput={this.saveScore}/>
                    </div>

                    <h3>2. Housekeeping &#38; General Cleanliness (20%)</h3>
                    <h4>General Environment Cleanliness</h4>
                    <div class="form-group">
                        <label>Cleaning and maintenance records for equipment, ventilation and exhaust system.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="014" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Adequate and regular pest control.</label>
                        <ul>
                            <li key="015">Pest control record.</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="015" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Goods and equipment are within shop boundary.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="016" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Store display/ Shop front is neat and tidy.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="017" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Work/ serving area is neat, clean and free of spillage.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="018" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Uncluttered circulation space free of refuse/ furniture.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="019" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Tables are cleared promptly within 10 minutes.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="020" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Fixtures and fittings including shelves, cupboards and drawers are clean and dry and in a good state.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="021" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Ceiling/ ceiling boards are free from stains/ dust with no gaps.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="022" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Fans and air-con units are in proper working order and clean and free from dust. Proper maintenance and routine cleaning are carried out regularly.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="023" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Equipment, exhaust hood, crockery and utensils are clean, in good condition and serviced.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="024" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Surfaces, walls and ceilings within customer areas are dry and clean.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="025" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Floor within customer areas is clean, dry and non-greasy.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="026" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Waste bins are properly lined with plastic bags and covered at all times.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="027" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Adequate number of covered waste pedal bins are available and waste is properly managed and disposed.</label>
                        <ul>
                            <li key="028.1">Waste bins are not over-filled.</li>
                            <li key="028.2">Waste Management: Proper disposal of food stuff and waste.</li>
                            <li key="028.3">Waste is properly bagged before disposing it at the waste disposal area/ bin centre.</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="028" onInput={this.saveScore}/>
                    </div>

                    <h4>Hand Hygiene Facilities</h4>
                    <div class="form-group">
                        <label>Hand washing facilities are easily accessible, in good working condition and soap is provided.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="029" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Adequate facilities for hand hygiene are available including liquid soap and disposable hand towels.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="030" onInput={this.saveScore}/>
                    </div>


                    <h3>3. Food Hygiene (35%)</h3>
                    <h4>Storage &#38; Preparation of Food</h4>
                    <div class="form-group">
                        <label>Food is stored in appropriate conditions and at an appropriate temperature.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="031" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food and non-food are clearly segregated.</label>
                        <ul>
                            <li key="032">Non-food items (e.g. insecticides, detergents and other chemicals) are not stored together with the food items.</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="032" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food is not placed near sources of contamination.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="033" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Storage of food does not invite pest infestation.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="034" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Dry goods (e.g. canned food and drinks) and other food items are stored neatly on shelves, off the floor and away from walls.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="035" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Proper stock rotation system such as the First-Expired-First-Out (FEFO) system is used for inventory management.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="036" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food is protected from contamination; packaging is intact and no products are found with signs of spoilage.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="037" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Ice machine is clean and well maintained.</label>
                        <ul>
                            <li key="038">Only ice is stored in the ice machine to prevent contamination of the ice.</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="038" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Scoop for ice is stored outside the ice machine in a dedicated container.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="039" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food supplied is clean and not expired.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="040" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Clear labelling of date of date of preparation/ manufacture/ expiry on all food containers/packaging.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="041" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Cooked food is properly covered to prevent cross-contamination.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="042" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Proper work flow and segregation of areas to prevent cross-contamination between raw and cooked/ ready-to-eat food areas.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="043" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Proper separation of cooked food/ ready-to-eat food, raw meat, seafood and vegetable to prevent cross-contamination.</label>
                        <ul>
                            <li>E.g. Different chopping boards, knives and other utensils are used for cooked/ ready-to-eat and raw food.</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="044" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Frozen food is thawed in chiller, microwave or under running water.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="045" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Ingredients used are clean and washed thoroughly before cooking.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="046" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>All cooking ingredient (e.g. cooking oil, sauces) are properly covered in proper containers and properly labelled, indicating the content and date of expiry.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="047" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>All sauces are stored at appropriate condition &#38; temperature.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="048" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Cooking oil is not used for more than 1 day.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="049" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Cooking oil is properly stored with a cover.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="050" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Perishable food is stored in the fridge.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="051" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Raw food and cooked food/ ready to serve food are clearly segregated.</label>
                        <ul>
                            <li key="052">Cold and/ or hot holding units are clean and well maintained.</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="052" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food preparation area is free of bird and animal (e.g. dog or cat).</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="053" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food preparation area is clean, free of pests and in good state of repair.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="054" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food is not prepared on the floor, near drain or near/ in toilet.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="055" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Personal belongings are kept separately in the staff locker area or cabinet, away from the food storage and preparation area.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="056" onInput={this.saveScore}/>
                    </div>

                    <h4>Storage of Food in Refrigerator/ Warmer</h4>
                    <div class="form-group">
                        <label>Daily Temperature Log for food storage units (freezers, chillers, warmers, steamers, ovens) using independent thermometer, etc. is maintained for inspection from time to time.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="057" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food storage units (freezers, chillers, warmers, steamers, ovens) are kept clean and well maintained. All rubber gaskets of refrigerators / warmers are free from defect, dirt and mould.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="058" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food storage units are not overstocked to allow good air circulation.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="059" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>For walk-in freezers and chillers, food items are stored neatly on shelves and off the floor.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="060" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Frozen food is stored at a temperature of not more than &#45;12°C.</label>
                        <ul>
                            <li key="061">Freezer’s temperature: &#60; &#45;12°.</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="061" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Chilled food is stored at a temperature of not more than 4°C.</label>
                        <ul>
                            <li key="062">Chiller’s temperature: 0°C &#126; 4°C</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="062" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Hot food are held above 60°C.</label>
                        <ul>
                            <li key="063">Food warmer’s temperature: &#62; 60°C</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="063" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Perishable food is stored at a temperature of not more than 4°C.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="064" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Dairy products are stored at a temperature of not more than 7°C.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="065" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Cooked/ ready-to-eat food are stored above raw food.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="066" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Food items are properly wrapped/covered in proper containers and protected from contamination.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="067" onInput={this.saveScore}/>
                    </div>

                    <h3>4. Healthier Choice in line with HPB’s Healthy Eating’s Initiative (15%)</h3>
                    <h4>Food</h4>
                    <div class="form-group">
                        <label>Min. no. of healthier variety of food items per stall.</label>
                        <ul>
                            <li key="068">Lease Term: 50% of food items</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="068" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Label caloric count of healthier options.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="069" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Include HPB’s Identifiers beside healthier options.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="070" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Use of healthier cooking oils.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="071" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Offer wholemeal/ whole-grain option.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="072" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Healthier option food sold at lower price than regular items.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="073" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Limit deep-fried and pre-deep fried food items sold (&#8804; 20% deep-fried items).</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="074" onInput={this.saveScore}/>
                    </div>

                    <h4>Beverage</h4>
                    <div class="form-group">
                        <label>No sugar / Lower-sugar brewed beverage offerings according to guidelines.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="075" onInput={this.saveScore}/>
                    </div>                    
                    <div class="form-group">
                        <label>Healthier option beverages sold at lower price than regular items.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="076" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Label caloric count of healthier options.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="077" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Limit sugar content on commercially-prepared sweetened beverages. (&#8805; 70% commercially-prepared sweetened beverages sold to have HCS)</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="078" onInput={this.saveScore}/>
                    </div>


                    <h3>5. Workplace Safety &#38; Health (20%)</h3>
                    <h4>General Safety</h4>
                    <div class="form-group">
                        <label>All food handlers have Basic Food Hygiene certificate and a valid Refresher Food Hygiene certificate (if applicable).</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="079" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>MSDS for all industrial chemicals are available and up to date.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="080" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Proper chemicals storage.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="081" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>All detergent and bottles containing liquids are labelled appropriately.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="082" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>All personnel to wear safety shoes and safety attire where necessary.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="083" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Knives and sharp objects are kept at a safe place.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="084" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Area under the sink should not be cluttered with items other than washing agents.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="085" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Delivery personnel do not stack goods above the shoulder level.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="086" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Stacking of goods does not exceed 600mm from the ceiling and heavy items at the bottom, light items on top.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="087" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Proper signage/ label (fire, hazards, warnings, food stuff) and Exit signs in working order.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="088" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Equipment, crockery and utensils are not chipped, broken or cracked.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="089" onInput={this.saveScore}/>
                    </div>

                    <h4>Fire &#38; Emergency Safety</h4>
                    <div class="form-group">
                        <label>Fire extinguishers access is unobstructed; Fire extinguishers are not expired and employees know how to use them.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="090" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Escape route and exits are unobstructed.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="091" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>First aid box is available and well-equipped.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="092" onInput={this.saveScore}/>
                    </div>

                    <h4>Electrical Safety</h4>
                    <div class="form-group">
                        <label>Electrical sockets are not overloaded – one plug to one socket.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="093" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Plugs and cords are intact and free from exposure/ tension with PSB safety mark.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="094" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Power points that are in close proximity to flammable and/or water sources are installed with a plastic cover.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="095" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Electrical panels / DBs are covered.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="096" onInput={this.saveScore}/>
                    </div>

                    
                    <button type="button" class={this.getButtonClasses()} onClick={this.tabulateScore}>Tabulate scores</button>

                    <h4>Scoring</h4>
                    <p>1. Professionalism &#38; Staff Hygiene: {this.state.profStaffHydScore} /10%</p>
                    <p>2. Housekeeping &#38; General Cleanliness: {this.state.housekeepScore} /20%</p>
                    <p>3. Food Hygiene: {this.state.foodHydScore} /35%</p>
                    <p>4. Healthier Choice in line with HPB’s Healthy Eating’s Initiative: {this.state.healthierScore} /15%</p>
                    <p>5. Workplace Safety &#38; Health: {this.state.workSafetyHealthScore} /20%</p>
                    <p>Total Score: {this.state.totoalScore} /100%</p>
                    <label>Comments:</label>
                    <input onInput={this.saveComment} type="text" />
                </form>
                <button type="submit" class={this.getButtonClasses()} onClick={this.handleSubmit}>Submit</button>

            </div>
        )
    }

    saveAuditee = (event) => {
        const data = event.target.value;
        var newScoreDict = this.state.scoreDict;
        var newFinalDict = this.state.finalDict;
        if (data === "Choose...") {
            newScoreDict["auditeeName"] = "";
            newFinalDict["auditeeName"] = "";
            this.setState({auditeeName: event.target.value, scoreDict: newScoreDict, finalDict: newFinalDict});
        } else {
            const index = parseInt(data);
            newScoreDict["auditeeName"] = this.state.auditeeArray[index]["email"];
            newFinalDict["auditeeName"] = this.state.auditeeArray[index]["email"];
            this.setState({scoreDict: newScoreDict, finalDict: newFinalDict});
        }
    }

    handleAuditee = (index) => {
        if (this.state.auditeeArray.length === 0){
            return "-";
        } else {
            return this.state.auditeeArray[index]["firstName"] + " " + this.state.auditeeArray[index]["lastName"];
        }
    }

    handleAuditor = event => {
        var newScoreDict = this.state.scoreDict;
        var newFinalDict = this.state.finalDict;
        if (event.target.value !== -1) {
            newScoreDict["auditorName"] = event.target.value;
            newFinalDict["auditorName"] = event.target.value;
            this.setState({auditorName: event.target.value, scoreDict: newScoreDict, finalDict: newFinalDict});
        } else {
            newScoreDict["auditorName"] = "";
            newFinalDict["auditorName"] = "";
            this.setState({scoreDict: newScoreDict, finalDict: newFinalDict});
        }
    }

    handleDepartment = event => {
        var newScoreDict = this.state.scoreDict;
        var newFinalDict = this.state.finalDict;
        if (event.target.value !== -1) {
            newScoreDict["auditorDepartment"] = event.target.value;
            newFinalDict["auditorDepartment"] = event.target.value;
            this.setState({auditorDepartment: event.target.value, scoreDict: newScoreDict, finalDict: newFinalDict});
        } else {
            newScoreDict["auditorDepartment"] = "";
            newFinalDict["auditorDepartment"] = "";
            this.setState({scoreDict: newScoreDict, finalDict: newFinalDict});
        }
    }

    saveScore = event => {
        var newScoreDict = this.state.scoreDict;
        if (event.target.value >= 0) {
            newScoreDict[event.target.id] = event.target.value;
        } else {
            newScoreDict[event.target.id] = 0;
        }
        this.setState({scoreDict: newScoreDict});
        this.updateSectionScore(event.target.id, event.target.value);
    }

    // q1: 13
    // q2: 17
    // q3: 37
    // q4: 11
    // q5: 18
    updateSectionScore = (qnId, qnValue) => {
        let newProfStaffHydScore = this.state.profStaffHydScore;
        let newHousekeepScore = this.state.housekeepScore;
        let newFoodHydScore = this.state.foodHydScore;
        let newHealthierScore = this.state.healthierScore;
        let newWorkSafetyHealthScore = this.state.workSafetyHealthScore;
        let newFinalDict = this.state.finalDict;

        // formula: score = (currentScore  / (numQ * maxScoreForOneQ) ) * weightageForTheSection
        if (qnId <= 13) {
            newProfStaffHydScore += parseInt(qnValue);
            newProfStaffHydScore = (newProfStaffHydScore / 130) * 10;
            newFinalDict["profStaffHydScore"] = newProfStaffHydScore;
        }
        else if (qnId >= 14 &&  qnId <= 30) {
            newHousekeepScore += parseInt(qnValue);
            newHousekeepScore = (newHousekeepScore / 170) * 20;
            newFinalDict["housekeepScore"] = newHousekeepScore;
        }
        else if (qnId >= 31 &&  qnId <= 67) {
            newFoodHydScore += parseInt(qnValue);
            newFoodHydScore = (newFoodHydScore / 370) * 35;
            newFinalDict["foodHydScore"] = newFoodHydScore;
        }
        else if (qnId >= 68 &&  qnId <= 78) {
            newHealthierScore += parseInt(qnValue);
            newHealthierScore = (newHealthierScore / 110) * 15;
            newFinalDict["healthierScore"] = newHealthierScore;
        }
        else if (qnId >= 79) {
            newWorkSafetyHealthScore += parseInt(qnValue);
            newWorkSafetyHealthScore = (newWorkSafetyHealthScore / 180) * 20;
            newFinalDict["workSafetyHealthScore"] = newWorkSafetyHealthScore;
        }

        let total = newProfStaffHydScore + newHousekeepScore + newFoodHydScore + newHealthierScore + newWorkSafetyHealthScore;

        this.setState({
            profStaffHydScore: newProfStaffHydScore,
            housekeepScore: newHousekeepScore,
            foodHydScore: newFoodHydScore,
            healthierScore: newHealthierScore,
            workSafetyHealthScore: newWorkSafetyHealthScore,
            totoalScore: total,
            finalDict: newFinalDict
        });
    }

    saveComment = event => {
        var newFinalDict = this.state.finalDict;
        newFinalDict["comment"] = event.target.value;
        this.setState({comment: event.target.value});
    }

    handleSubmit = event  => {
        event.preventDefault();
        console.log("final: ", this.state.finalDict);

        if (Object.keys(this.state.scoreDict).length < (this.state.dataLength - 1)) {
            console.log("empty field");
            alert("Please fill up all fields");
        } else { 
            // all data has been filled
            // proceeds to send data to backend
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*'
            };
            
            axios.post("http://localhost:5000/auditChecklistFB", this.state.finalDict, headers
            ).then( res => {
                console.log(res.statusText);
                alert("The form has been successfully recorded.");
            });
        }
    }

    tabulateScore = event => {
        if (Object.keys(this.state.scoreDict).length < (this.state.dataLength - 1)) {
            console.log("empty field");
        } else {
            // all data has been filled

            let profStaffHydScore = 0;
            let housekeepScore = 0;
            let foodHydScore = 0;
            let healthierScore = 0;
            let workSafetyHealthScore = 0;
            let newFinalDict = this.state.finalDict;

            for (let k in this.state.scoreDict) {
                let data = this.state.scoreDict[k];
                if (Number.isInteger(parseInt(data))) {
                    if (k <= 13) {
                        profStaffHydScore += parseInt(data);
                    } else if ( k >= 14 &&  k <= 30) {
                        housekeepScore += parseInt(data);
                    } else if ( k >= 31 &&  k <= 67) {
                        foodHydScore += parseInt(data);
                    } else if ( k >= 68 &&  k <= 78) {
                        healthierScore += parseInt(data);
                    } else if (k >= 79 ) {
                        workSafetyHealthScore += parseInt(data);
                    }
                } else {
                    continue;
                }
            }

            // formula: score = (currentScore  / (numQ * maxScoreForOneQ) ) * weightageForTheSection
            profStaffHydScore = (profStaffHydScore / 60) * 20;
            housekeepScore = (housekeepScore / 60) * 20;
            foodHydScore = (foodHydScore / 60) * 20;
            healthierScore = (healthierScore / 120) * 40;
            workSafetyHealthScore = (workSafetyHealthScore / 160) * 40;

            newFinalDict["profStaffHydScore"] = profStaffHydScore;
            newFinalDict["housekeepScore"] = housekeepScore;
            newFinalDict["foodHydScore"] = foodHydScore;
            newFinalDict["healthierScore"] = healthierScore;
            newFinalDict["workSafetyHealthScore"] = workSafetyHealthScore;


            let total = profStaffHydScore + housekeepScore + foodHydScore + healthierScore + workSafetyHealthScore;

            this.setState({
                profStaffHydScore: profStaffHydScore,
                housekeepScore: housekeepScore,
                foodHydScore: foodHydScore,
                healthierScore: healthierScore,
                workSafetyHealthScore: workSafetyHealthScore,
                totoalScore: total,
                finalDict: newFinalDict
            });

        }
    }

    validateData = () => {
        if (Object.keys(this.state.finalDict).length === 1 ) {
            return false;
        }
        else if (Object.keys(this.state.scoreDict).length < (this.state.dataLength - 1)) {
            return false;
        } else {
            return true;
        }
    }

    getButtonClasses() {
        let classes = 'btn btn-';
        classes += this.validateData() === false ? 'secondary' : 'primary';
        return classes;
    }

    

}

export default AuditChecklistFB;