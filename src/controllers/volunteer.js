import * as services from "../services/volunteer";

export const registerVolunteer = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { skills, experience } = req.body;
        const userId = req.user?.id;

        const response = await services.registerVolunteerService(
            campaignId,
            { skills, experience },
            userId
        );
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at register volunteer controller: " + error,
        });
    }
};
export const getAllVolunteer = async (req, res) => {
    try {
        const organizationId = req.user.id;
        if (!organizationId)
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });

        const response = await services.getAllVolunteerService(organizationId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at get all volunteer controller: " + error,
        });
    }
};

export const deleteVolunteer = async (req, res) => {
    const volunteerId = req.query.id;
    const organizationId = req.user.id;

    try {
        if (!volunteerId || !organizationId)
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        const response = await services.deleteVolunteerService(volunteerId);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at volunteer controller: " + error,
        });
    }
};

export const approvedVolunteer = async (req, res) => {
    const volunteerId = req.query.id;
    const organizationId = req.user.id;
    try {
        if (!volunteerId || !organizationId)
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        const response = await services.approvedVolunteerService(volunteerId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Fail at change role controller: " + error,
        });
    }
};

export const getVolunteerById = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId)
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });

        const response = await services.getVolunteerByIdService(userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at get volunteer by userId controller: " + error,
        });
    }
};
